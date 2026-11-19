/**
 * MediSlot AI - Main Application Logic & Reactive State Management
 */

(function () {
  'use strict';

  // State
  const state = {
    currentRoute: 'landing',
    providers: [],
    appointments: [],
    ledger: { total: 12, upcoming: 2, completed: 9, cancelled: 1 },
    activities: [],
    selectedProvider: null,
    selectedSlot: null,
    activeCategory: 'All',
    searchQuery: '',
    filters: {
      availableToday: false,
      tomorrowAfternoon: false,
      inNetwork: false,
      topRated: false
    },
    chatMessages: []
  };

  // DOM Elements Cache
  let views = {};

  document.addEventListener('DOMContentLoaded', async () => {
    cacheElements();
    initRouter();
    await loadData();
    setupEventListeners();
    setupLandingInteractions();
    renderAll();
  });

  function cacheElements() {
    views = {
      landing: document.getElementById('view-landing'),
      dashboard: document.getElementById('view-dashboard'),
      providers: document.getElementById('view-providers'),
      assistant: document.getElementById('view-assistant'),
      bookings: document.getElementById('view-bookings'),
      admin: document.getElementById('view-admin')
    };
  }

  // Router
  function initRouter() {
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#landing';
    } else {
      handleHashChange();
    }
  }

  function handleHashChange() {
    const rawHash = window.location.hash.replace('#', '') || 'landing';
    const cleanHash = rawHash.split('?')[0];
    navigateTo(cleanHash, false);
  }

  function navigateTo(route, updateHash = true) {
    if (!views[route]) route = 'landing';
    state.currentRoute = route;

    if (updateHash) {
      window.location.hash = '#' + route;
    }

    // Toggle view containers
    Object.keys(views).forEach(k => {
      if (views[k]) {
        if (k === route) {
          views[k].classList.remove('hidden');
        } else {
          views[k].classList.add('hidden');
        }
      }
    });

    // Toggle navigation visibility (Landing has its own top nav; inner screens show bottom nav & top app header)
    const topAppHeader = document.getElementById('top-app-header');
    const bottomNav = document.getElementById('bottom-nav');

    if (route === 'landing') {
      if (topAppHeader) topAppHeader.classList.add('hidden');
      if (bottomNav) bottomNav.classList.add('hidden');
    } else {
      if (topAppHeader) topAppHeader.classList.remove('hidden');
      if (bottomNav) bottomNav.classList.remove('hidden');
    }

    // Update bottom nav active classes
    updateNavSelection(route);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh specific view data
    if (route === 'dashboard') renderDashboard();
    if (route === 'providers') renderProviders();
    if (route === 'bookings') renderBookings();
    if (route === 'admin') renderAdmin();
  }

  function updateNavSelection(route) {
    const navItems = document.querySelectorAll('#bottom-nav [data-route]');
    navItems.forEach(item => {
      const itemRoute = item.getAttribute('data-route');
      const isCenter = item.classList.contains('center-btn');

      if (itemRoute === route) {
        if (!isCenter) {
          item.classList.add('bg-primary-container', 'text-on-surface', 'border-2', 'border-black', 'shadow-[2px_2px_0px_#000000]', 'font-bold');
          item.classList.remove('text-on-surface-variant');
        } else {
          item.classList.add('ring-4', 'ring-black');
        }
      } else {
        if (!isCenter) {
          item.classList.remove('bg-primary-container', 'text-on-surface', 'border-2', 'border-black', 'shadow-[2px_2px_0px_#000000]', 'font-bold');
          item.classList.add('text-on-surface-variant');
        } else {
          item.classList.remove('ring-4', 'ring-black');
        }
      }
    });
  }

  // Load Data
  async function loadData() {
    updateSupabaseStatusBadge();
    state.providers = await window.MediSlotDB.getProviders();
    state.appointments = await window.MediSlotDB.getAppointments();
    state.ledger = window.MediSlotDB.getLedgerStats();
    state.activities = window.MediSlotDB.getActivityLogs();
  }

  function updateSupabaseStatusBadge() {
    const status = window.MediSlotDB.getStatus();
    const badge = document.getElementById('supabase-status-indicator');
    const text = document.getElementById('supabase-status-text');
    if (!badge || !text) return;

    if (status.isLive) {
      badge.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black shadow-[1px_1px_0px_#000000] animate-pulse';
      text.textContent = 'Supabase Cloud';
      text.className = 'text-emerald-700 font-extrabold uppercase text-[10px] tracking-wider';
    } else {
      badge.className = 'w-2.5 h-2.5 rounded-full bg-primary-fixed border border-black shadow-[1px_1px_0px_#000000]';
      text.textContent = 'Local Engine';
      text.className = 'text-on-surface-variant font-extrabold uppercase text-[10px] tracking-wider';
    }
  }

  // Render All
  function renderAll() {
    renderDashboard();
    renderProviders();
    renderBookings();
    renderAdmin();
  }

  // --- 1. Customer Dashboard ---
  function renderDashboard() {
    // Ledger stats
    const totalEl = document.getElementById('stat-total-booked');
    const upcomingEl = document.getElementById('stat-upcoming');
    const completedEl = document.getElementById('stat-completed');
    const cancelledEl = document.getElementById('stat-cancelled');

    if (totalEl) totalEl.textContent = state.ledger.total || 12;
    if (upcomingEl) upcomingEl.textContent = state.ledger.upcoming || 2;
    if (completedEl) completedEl.textContent = state.ledger.completed || 9;
    if (cancelledEl) cancelledEl.textContent = state.ledger.cancelled || 1;

    // Priority Appointment
    const priorityCard = document.getElementById('priority-appointment-card');
    const confirmedApts = state.appointments.filter(a => a.status === 'confirmed');
    const priority = confirmedApts[0];

    if (priorityCard) {
      if (priority) {
        priorityCard.innerHTML = `
          <!-- Status pill floating header -->
          <div class="flex items-start justify-between gap-2 border-b-2 border-surface-container pb-3">
            <div class="flex items-center gap-3 min-w-0">
              <img class="w-12 h-12 rounded-lg border-2 border-black object-cover shadow-[2px_2px_0px_#000000] flex-shrink-0"
                   src="${priority.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUKSoQZkW4qI9vJJ6eEoE0OaHI0WOdTn6LlR6OzJfeFTT6mE-bonF5wYlT2f8f7dhAZwPoRLjsnHv1DOUTX9rglH34qIC4NmvxBqwAIYEl-ZJRDUgoi35rDm5m_qKHms7MEtb98w1ikNsRg7iUIKt_tGu-bUVrFbGOm7iZB6-D-w0qomWveX9Xidp2hcF5eCGwwSoChsHaN6CdeP_VzrRoPJN6CoFY4EmC-X5wgU'}" alt="${priority.provider_name}"/>
              <div class="flex flex-col min-w-0">
                <span class="font-title-md text-title-md text-on-surface truncate">${priority.provider_name}</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px] text-primary" style="font-variation-settings: 'FILL' 1;">cardiology</span>
                  ${priority.specialty}
                </span>
              </div>
            </div>
            <span class="px-2 py-1 bg-primary-container text-on-surface font-label-sm text-label-sm uppercase rounded border-2 border-black shadow-[2px_2px_0px_#000000] font-extrabold flex-shrink-0">
              CONFIRMED
            </span>
          </div>
          <!-- Time & Clinic Meta Blocks -->
          <div class="grid grid-cols-2 gap-2 text-on-surface">
            <div class="bg-surface-container-low p-2 rounded-lg border border-black flex items-center gap-2">
              <div class="w-7 h-7 rounded bg-surface-container-lowest border border-black flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[16px] text-primary">schedule</span>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-label-sm text-label-sm text-outline uppercase font-extrabold">Time Slot</span>
                <span class="font-label-md text-label-md truncate">${priority.appointment_time}</span>
              </div>
            </div>
            <div class="bg-surface-container-low p-2 rounded-lg border border-black flex items-center gap-2">
              <div class="w-7 h-7 rounded bg-surface-container-lowest border border-black flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[16px] text-secondary">pin_drop</span>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-label-sm text-label-sm text-outline uppercase font-extrabold">Location</span>
                <span class="font-label-md text-label-md truncate">${priority.clinic_name}</span>
              </div>
            </div>
          </div>
          <!-- Doctor Action Row -->
          <div class="flex items-center gap-2 pt-1">
            <button onclick="window.MediSlotApp.openPassModal('${priority.id}')"
                    class="flex-1 py-2 px-3 bg-primary-container text-on-surface border-2 border-black rounded-lg shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all font-label-md text-label-md flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">qr_code_2</span>
              <span>View Pass</span>
            </button>
            <button onclick="window.MediSlotApp.openRescheduleModal('${priority.id}')"
                    class="flex-1 py-2 px-3 bg-surface-container-lowest text-on-surface border-2 border-black rounded-lg shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-error-container hover:text-on-error-container transition-all font-label-md text-label-md flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>Reschedule</span>
            </button>
          </div>
        `;
      } else {
        priorityCard.innerHTML = `
          <div class="p-4 text-center space-y-2">
            <p class="font-title-md text-on-surface">No upcoming appointments right now.</p>
            <button onclick="window.location.hash='#providers'" class="px-4 py-2 bg-primary-container text-on-surface font-label-md rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              Find a Doctor
            </button>
          </div>
        `;
      }
    }

    // Activity Log
    const activityContainer = document.getElementById('dashboard-activity-log');
    if (activityContainer) {
      const logs = window.MediSlotDB.getActivityLogs();
      activityContainer.innerHTML = logs.slice(0, 3).map((item, idx, arr) => `
        <div class="flex items-start gap-3 relative ${idx < arr.length - 1 ? 'pb-3 border-b border-surface-container-highest' : ''}">
          <div class="w-7 h-7 rounded ${item.badge_bg || 'bg-primary-container'} border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[1px_1px_0px_#000000]">
            <span class="material-symbols-outlined text-[15px] ${item.badge_text || 'text-on-surface'}">${item.icon || 'sync'}</span>
          </div>
          <div class="flex flex-col flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <span class="font-label-md text-label-md text-on-surface truncate">${item.title}</span>
              <span class="font-label-sm text-label-sm text-outline flex-shrink-0">${item.time_ago}</span>
            </div>
            <span class="font-body-sm text-body-sm text-on-surface-variant truncate">${item.description}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // --- 2. Providers List ---
  function renderProviders() {
    const listContainer = document.getElementById('providers-list');
    if (!listContainer) return;

    const filtered = state.providers.filter(p => {
      if (state.activeCategory !== 'All') {
        if (p.category.toLowerCase() !== state.activeCategory.toLowerCase()) return false;
      }
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const match = p.name.toLowerCase().includes(q) ||
                      p.specialty.toLowerCase().includes(q) ||
                      p.clinic_name.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (state.filters.inNetwork && !p.in_network) return false;
      if (state.filters.topRated && p.rating < 4.9) return false;
      return true;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center bg-surface-container-lowest border-2 border-black rounded-lg shadow-[4px_4px_0px_#000000]">
          <span class="material-symbols-outlined text-[48px] text-outline">search_off</span>
          <p class="font-title-md text-on-surface mt-2">No providers match your criteria</p>
          <p class="font-body-sm text-secondary mt-1">Try resetting filters or searching another keyword.</p>
          <button onclick="window.MediSlotApp.resetFilters()" class="mt-4 px-4 py-2 bg-primary-container text-on-surface font-label-md rounded border-2 border-black shadow-[2px_2px_0px_#000000]">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(provider => `
      <div class="relative bg-surface-container-lowest border-2 border-black rounded-lg p-space-md shadow-[4px_4px_0px_#000000] flex flex-col gap-3">
        <!-- Top Meta Bar -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-3">
            <div class="relative w-14 h-14 rounded-lg border-2 border-black bg-surface-container overflow-hidden shadow-[2px_2px_0px_#000000] flex-shrink-0">
              <img class="w-full h-full object-cover" src="${provider.image_url}" alt="${provider.name}"/>
            </div>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-1.5">
                <h2 class="font-title-md text-title-md text-on-surface font-bold truncate">${provider.name}, ${provider.credentials}</h2>
                <span class="material-symbols-outlined text-primary text-[18px]" style="font-variation-settings: 'FILL' 1;">verified</span>
              </div>
              <p class="font-label-md text-label-md text-on-surface-variant truncate">${provider.specialty}</p>
              <p class="font-body-sm text-body-sm text-outline truncate flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">domain</span>
                ${provider.clinic_name}
              </p>
            </div>
          </div>
          <button onclick="window.MediSlotApp.toggleBookmark('${provider.id}', this)"
                  aria-label="Bookmark provider"
                  class="w-8 h-8 rounded border-2 border-black flex items-center justify-center bg-surface-container-lowest active:bg-secondary-fixed transition-colors">
            <span class="material-symbols-outlined text-[18px]">bookmark</span>
          </button>
        </div>
        <!-- Rating & Qualifications Ribbon -->
        <div class="flex flex-wrap items-center gap-2 pt-1 border-t-2 border-black/10">
          <div class="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded border border-black text-label-sm font-label-sm">
            <span class="material-symbols-outlined text-[14px] text-primary" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="text-on-surface font-bold">${provider.rating}</span>
            <span class="text-on-surface-variant">(${provider.reviews_count} reviews)</span>
          </div>
          <div class="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded border border-black text-label-sm font-label-sm text-on-surface-variant">
            <span class="material-symbols-outlined text-[14px]">workspace_premium</span>
            ${provider.experience_years} Yrs Exp
          </div>
          ${provider.telehealth_available ? `
            <div class="inline-flex items-center gap-1 bg-secondary-container px-2 py-0.5 rounded border border-black text-label-sm font-label-sm text-on-secondary-fixed">
              <span class="material-symbols-outlined text-[14px]">videocam</span>
              Telehealth Available
            </div>
          ` : `
            <div class="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded border border-black text-label-sm font-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[14px]">translate</span>
              ${(provider.languages || ['EN']).join(', ')}
            </div>
          `}
        </div>
        <!-- Next Available Slot Neo-Badge -->
        <div class="flex items-center justify-between bg-primary-container/40 border-2 border-black rounded-md p-2 shadow-[2px_2px_0px_#000000]">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-on-surface">alarm_on</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Next Opening</span>
          </div>
          <span class="font-label-md text-label-md bg-primary-container text-on-surface px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000000]">
            ${provider.next_opening}
          </span>
        </div>
        <!-- Action Button Group -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="window.MediSlotApp.openProfileModal('${provider.id}')"
                  class="w-full py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[16px]">id_card</span>
            View Profile
          </button>
          <button onclick="window.MediSlotApp.openBookingModal('${provider.id}')"
                  class="w-full py-2.5 rounded-lg bg-primary-container text-on-surface font-label-md text-label-md border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1 font-bold">
            <span class="material-symbols-outlined text-[16px]">event_available</span>
            Book Slot
          </button>
        </div>
      </div>
    `).join('');
  }

  // --- 3. Bookings View (My Appointments) ---
  function renderBookings() {
    const activeContainer = document.getElementById('active-bookings-list');
    const pastContainer = document.getElementById('past-bookings-list');
    if (!activeContainer || !pastContainer) return;

    const confirmed = state.appointments.filter(a => a.status === 'confirmed');
    const past = state.appointments.filter(a => a.status !== 'confirmed');

    if (confirmed.length === 0) {
      activeContainer.innerHTML = `
        <div class="p-6 text-center bg-surface-container-lowest border-2 border-black rounded-lg shadow-[3px_3px_0px_#000000]">
          <p class="font-body-md text-on-surface font-semibold">You have no upcoming active appointments.</p>
          <button onclick="window.location.hash='#providers'" class="mt-3 px-4 py-2 bg-primary-container text-on-surface font-label-md rounded border-2 border-black shadow-[2px_2px_0px_#000000]">
            Browse Available Doctors
          </button>
        </div>
      `;
    } else {
      activeContainer.innerHTML = confirmed.map(apt => `
        <div class="bg-surface-container-lowest rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] p-4 flex flex-col gap-3">
          <div class="flex items-start justify-between border-b pb-2 border-black/10">
            <div>
              <span class="font-title-md text-on-surface font-bold">${apt.provider_name}</span>
              <p class="font-body-sm text-secondary">${apt.specialty}</p>
            </div>
            <span class="px-2 py-0.5 bg-primary-container text-on-surface font-label-sm font-bold uppercase rounded border border-black shadow-[1px_1px_0px_#000000]">
              ${apt.status}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-body-sm">
            <div class="p-2 bg-surface-container-low rounded border border-black flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
              <span>${apt.appointment_date} · ${apt.appointment_time}</span>
            </div>
            <div class="p-2 bg-surface-container-low rounded border border-black flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-secondary">pin_drop</span>
              <span class="truncate">${apt.clinic_name}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <button onclick="window.MediSlotApp.openPassModal('${apt.id}')"
                    class="flex-1 py-2 bg-primary-container text-on-surface font-label-md rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-[16px]">qr_code_2</span>
              Digital Pass
            </button>
            <button onclick="window.MediSlotApp.openRescheduleModal('${apt.id}')"
                    class="flex-1 py-2 bg-surface-container-lowest text-on-surface font-label-md rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
              Reschedule
            </button>
            <button onclick="window.MediSlotApp.cancelAppointment('${apt.id}')"
                    class="p-2 bg-surface-container-lowest hover:bg-error-container text-error rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    title="Cancel Appointment">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      `).join('');
    }

    if (past.length === 0) {
      pastContainer.innerHTML = `<p class="font-body-sm text-secondary italic">No past appointments recorded.</p>`;
    } else {
      pastContainer.innerHTML = past.map(apt => `
        <div class="bg-surface-container-low rounded-lg border border-black p-3 flex items-center justify-between opacity-80">
          <div>
            <span class="font-title-sm text-on-surface font-bold">${apt.provider_name}</span>
            <p class="font-body-sm text-secondary">${apt.specialty} · ${apt.appointment_date}</p>
          </div>
          <span class="px-2 py-0.5 rounded border border-black text-label-sm font-bold uppercase ${apt.status === 'cancelled' ? 'bg-error-container text-error' : 'bg-surface-container-highest text-secondary'}">
            ${apt.status}
          </span>
        </div>
      `).join('');
    }
  }

  // --- 4. Admin View ---
  function renderAdmin() {
    const adminProvidersContainer = document.getElementById('admin-providers-list');
    if (!adminProvidersContainer) return;

    adminProvidersContainer.innerHTML = state.providers.map(p => `
      <div class="bg-surface-container-lowest p-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <img class="w-10 h-10 rounded border border-black object-cover" src="${p.image_url}"/>
          <div class="truncate">
            <h4 class="font-title-sm text-on-surface font-bold truncate">${p.name}</h4>
            <span class="font-body-sm text-secondary truncate">${p.specialty}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 bg-primary-container text-on-surface rounded border border-black font-label-sm font-bold">
            ${(p.available_slots || []).length} Slots
          </span>
          <button onclick="window.MediSlotApp.adminAddSlot('${p.id}')"
                  class="px-2 py-1 bg-surface-container text-on-surface border border-black rounded text-label-sm font-bold hover:bg-primary-container">
            + Slot
          </button>
        </div>
      </div>
    `).join('');
  }

  // --- 5. Interactive Landing Interactivity ---
  function setupLandingInteractions() {
    const toggleProblem = document.getElementById('toggleProblem');
    const toggleSolution = document.getElementById('toggleSolution');
    const legacyView = document.getElementById('legacyView');
    const solutionView = document.getElementById('solutionView');

    if (toggleProblem && toggleSolution && legacyView && solutionView) {
      toggleProblem.addEventListener('click', () => {
        legacyView.classList.remove('hidden');
        solutionView.classList.add('hidden');
        toggleProblem.classList.add('bg-surface-container-lowest', 'border', 'border-on-background', 'text-on-surface');
        toggleProblem.classList.remove('text-secondary');
        toggleSolution.classList.remove('bg-surface-container-lowest', 'border', 'border-on-background', 'text-on-surface');
        toggleSolution.classList.add('text-secondary');
      });

      toggleSolution.addEventListener('click', () => {
        solutionView.classList.remove('hidden');
        legacyView.classList.add('hidden');
        toggleSolution.classList.add('bg-surface-container-lowest', 'border', 'border-on-background', 'text-on-surface');
        toggleSolution.classList.remove('text-secondary');
        toggleProblem.classList.remove('bg-surface-container-lowest', 'border', 'border-on-background', 'text-on-surface');
        toggleProblem.classList.add('text-secondary');
      });
    }

    const matchBtn = document.getElementById('findSpecialistBtn');
    const symptomInput = document.getElementById('symptomInput');
    if (matchBtn && symptomInput) {
      matchBtn.addEventListener('click', () => {
        const query = symptomInput.value.trim();
        if (!query) {
          symptomInput.placeholder = "Please enter a symptom first!";
          symptomInput.focus();
        } else {
          matchBtn.textContent = "Matching...";
          setTimeout(() => {
            matchBtn.textContent = "3 Doctors Found";
            matchBtn.classList.remove('bg-primary-fixed');
            matchBtn.classList.add('bg-[#10b981]', 'text-white');
            setTimeout(() => {
              window.location.hash = '#providers?search=' + encodeURIComponent(query);
            }, 600);
          }, 600);
        }
      });
    }
  }

  // --- 6. Event Listeners ---
  function setupEventListeners() {
    // Search input in providers
    const searchInput = document.getElementById('providers-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        renderProviders();
      });
    }

    // Category Tabs in providers
    const categoryTabs = document.querySelectorAll('#category-tabs-row button');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => {
          t.className = 'flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-surface-container-lowest text-on-surface border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all';
        });
        tab.className = 'flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-primary-container text-on-surface border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all';
        const cat = tab.getAttribute('data-cat') || 'All';
        state.activeCategory = cat;
        renderProviders();
      });
    });

    // Quick Filters toggles in providers
    const filterButtons = document.querySelectorAll('.provider-filter-toggle');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterKey = btn.getAttribute('data-filter');
        if (filterKey && state.filters.hasOwnProperty(filterKey)) {
          state.filters[filterKey] = !state.filters[filterKey];
          if (state.filters[filterKey]) {
            btn.classList.add('bg-primary-container');
            btn.classList.remove('bg-surface-container-lowest');
          } else {
            btn.classList.remove('bg-primary-container');
            btn.classList.add('bg-surface-container-lowest');
          }
          renderProviders();
        }
      });
    });

    // AI Chat Form
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        if (input && input.value.trim()) {
          handleUserChat(input.value.trim());
          input.value = '';
        }
      });
    }
  }

  // --- 7. AI Chat Handling ---
  function handleUserChat(text) {
    const stream = document.getElementById('chat-stream');
    if (!stream) return;

    // Append User Message
    const userBubble = document.createElement('div');
    userBubble.className = 'flex items-start justify-end gap-space-sm w-full';
    userBubble.innerHTML = `
      <div class="flex flex-col items-end space-y-space-xs max-w-[85%]">
        <div class="bg-primary-container text-on-surface rounded-xl p-space-sm border-2 border-black shadow-[4px_4px_0px_#000000]">
          <p class="font-body-md text-body-md font-semibold text-on-surface">${escapeHtml(text)}</p>
        </div>
        <div class="flex items-center gap-1 px-1">
          <span class="font-label-sm text-label-sm text-on-surface-variant">Just now · Delivered</span>
          <span class="material-symbols-outlined text-[12px] text-primary">done_all</span>
        </div>
      </div>
      <div class="w-7 h-7 rounded-full bg-secondary-fixed border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[2px_2px_0px_#000000] overflow-hidden">
        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEjGhrvkFcRea3TnLnR-T5jqGB4jsK7VYJHlmtziwextzvnmy6OLQB-vDKys1hBa5RaWuVIZhnGK7ar8OhenzTwALm94aCuM1E4i-7vAf5lBlCgtfGWiseE0ZVMOI8AZxO4FQ8QbIyeqCZbpLuNtEdx5Yx1LJIx0I96F6ssQyMHY9YvQdkPaKASgs2-J2wWnOVMKsaZ43hiGgJ-wplZh-sGvWHL5EaJmrLO8afR9Q" alt="User avatar"/>
      </div>
    `;
    stream.appendChild(userBubble);
    userBubble.scrollIntoView({ behavior: 'smooth' });

    // Parse Intent
    const lower = text.toLowerCase();
    let specialty = 'General Practice / Primary Care';
    let targetDoctor = state.providers[0];
    let preferredDate = 'Tomorrow (Tuesday, Oct 29)';
    let targetWindow = 'Afternoon (1:00 PM – 5:00 PM)';

    if (lower.includes('dent') || lower.includes('tooth') || lower.includes('crown')) {
      specialty = 'Dental Care / General Dentistry';
      targetDoctor = state.providers.find(p => p.category === 'Dentists') || state.providers[1];
    } else if (lower.includes('cardio') || lower.includes('heart') || lower.includes('chest')) {
      specialty = 'Cardiology & Internal Medicine';
      targetDoctor = state.providers.find(p => p.category === 'Doctors') || state.providers[0];
    } else if (lower.includes('therap') || lower.includes('stress') || lower.includes('psych') || lower.includes('mental')) {
      specialty = 'Clinical Psychologist & Therapy';
      targetDoctor = state.providers.find(p => p.category === 'Consultants') || state.providers[2];
    }

    // Thinking indicator
    const thinkingEl = document.createElement('div');
    thinkingEl.className = 'flex items-center gap-2 p-3 bg-surface-container-low rounded-lg border border-black text-label-sm font-bold';
    thinkingEl.innerHTML = `
      <span class="material-symbols-outlined animate-spin text-[18px] text-primary">sync</span>
      <span>Neural dispatch searching live cancellation matrices...</span>
    `;
    stream.appendChild(thinkingEl);

    setTimeout(() => {
      thinkingEl.remove();

      // Bot Response with Extracted Model & Card
      const botResponse = document.createElement('div');
      botResponse.className = 'flex items-start gap-space-sm w-full';
      botResponse.innerHTML = `
        <div class="w-7 h-7 rounded-md bg-surface-container-highest border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[2px_2px_0px_#000000]">
          <span class="material-symbols-outlined text-[16px] text-on-surface">psychology</span>
        </div>
        <div class="flex flex-col space-y-space-sm flex-1 min-w-0">
          <div class="bg-surface-container-lowest text-on-surface rounded-xl p-space-sm border-2 border-black shadow-[4px_4px_0px_#000000]">
            <p class="font-body-md text-body-md leading-relaxed text-on-surface">
              Understood! I parsed your request and matched verified clinical rosters:
            </p>
          </div>
          <!-- Model Card -->
          <div class="bg-surface-container-lowest rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] overflow-hidden">
            <div class="bg-primary-container px-3 py-2 border-b-2 border-black flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-on-surface">filter_alt</span>
                <span class="font-title-md text-label-md text-on-surface uppercase tracking-wide">Extracted Request Model</span>
              </div>
              <span class="font-label-sm text-label-sm bg-surface-container-lowest px-1.5 py-0.5 rounded border border-black text-on-surface font-bold">100% Match</span>
            </div>
            <div class="p-space-sm space-y-2 bg-surface-bright">
              <div class="flex items-start justify-between gap-2 text-body-sm pb-1.5 border-b border-surface-container-highest">
                <span class="font-label-md text-secondary uppercase text-label-sm">Specialty</span>
                <span class="font-body-md text-body-sm font-bold text-on-surface text-right">${specialty}</span>
              </div>
              <div class="flex items-start justify-between gap-2 text-body-sm pb-1.5 border-b border-surface-container-highest">
                <span class="font-label-md text-secondary uppercase text-label-sm">Preferred Date</span>
                <span class="font-body-md text-body-sm font-bold text-on-surface text-right">${preferredDate}</span>
              </div>
              <div class="flex items-start justify-between gap-2 text-body-sm">
                <span class="font-label-md text-secondary uppercase text-label-sm">Target Window</span>
                <span class="font-body-md text-body-sm font-bold text-on-surface text-right">${targetWindow}</span>
              </div>
            </div>
          </div>
          <!-- Provider Slot Card -->
          <div class="bg-surface-container-lowest rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] p-space-sm flex flex-col space-y-space-sm relative">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1 bg-surface-dim text-on-surface px-2 py-0.5 rounded border border-black font-label-sm text-label-sm">
                <span class="material-symbols-outlined text-[13px] text-primary">workspace_premium</span>
                <span>TOP CLINICAL MATCH</span>
              </div>
              <div class="flex items-center gap-1 font-label-md text-label-md bg-secondary-container px-2 py-0.5 rounded border border-black text-on-secondary-fixed">
                <span class="material-symbols-outlined text-[14px] text-amber-500" style="font-variation-settings: 'FILL' 1;">star</span>
                <span>${targetDoctor.rating}</span>
                <span class="text-secondary">(${targetDoctor.reviews_count})</span>
              </div>
            </div>
            <div class="flex items-start gap-space-sm">
              <div class="w-14 h-14 rounded-lg border-2 border-black overflow-hidden flex-shrink-0 bg-surface-container-high shadow-[2px_2px_0px_#000000]">
                <img class="w-full h-full object-cover" src="${targetDoctor.image_url}" alt="${targetDoctor.name}"/>
              </div>
              <div class="flex flex-col min-w-0 flex-1">
                <h4 class="font-title-lg text-title-md text-on-surface leading-tight truncate">${targetDoctor.name}, ${targetDoctor.credentials}</h4>
                <p class="font-body-sm text-body-sm text-secondary truncate">${targetDoctor.clinic_name} · 1.4 mi</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-tertiary-container border border-black text-on-tertiary-fixed font-bold">In-Network</span>
                  <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">$${targetDoctor.estimated_copay || 25} Copay est.</span>
                </div>
              </div>
            </div>
            <button onclick="window.MediSlotApp.openBookingModal('${targetDoctor.id}')"
                    class="w-full bg-primary-container text-on-surface font-label-lg text-label-lg py-2.5 px-space-md rounded-lg border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-transform flex items-center justify-center gap-2 mt-1 font-bold">
              <span class="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Lock Next Slot (${targetDoctor.next_opening})</span>
            </button>
          </div>
        </div>
      `;
      stream.appendChild(botResponse);
      botResponse.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  }

  // --- 8. Modals & Actions Expose ---
  window.MediSlotApp = {
    navigateTo,
    resetFilters: () => {
      state.searchQuery = '';
      state.activeCategory = 'All';
      state.filters = { availableToday: false, tomorrowAfternoon: false, inNetwork: false, topRated: false };
      const searchInput = document.getElementById('providers-search-input');
      if (searchInput) searchInput.value = '';
      renderProviders();
    },
    handleSuggestion: (text) => {
      handleUserChat(text);
    },
    toggleBookmark: (id, btn) => {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        if (icon.textContent === 'bookmark') {
          icon.textContent = 'bookmark_added';
          btn.classList.add('bg-primary-container');
        } else {
          icon.textContent = 'bookmark';
          btn.classList.remove('bg-primary-container');
        }
      }
    },
    openBookingModal: (providerId) => {
      const provider = state.providers.find(p => p.id === providerId);
      if (!provider) return;
      state.selectedProvider = provider;

      const modal = document.getElementById('booking-modal');
      const content = document.getElementById('booking-modal-content');
      if (!modal || !content) return;

      content.innerHTML = `
        <div class="flex items-center justify-between border-b-2 border-black pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[24px]">event_available</span>
            <h3 class="font-headline-sm text-on-surface">Book Fast Slot</h3>
          </div>
          <button onclick="window.MediSlotApp.closeModal('booking-modal')" class="w-8 h-8 rounded border-2 border-black flex items-center justify-center bg-surface-container-lowest font-bold text-[18px]">✕</button>
        </div>
        <div class="space-y-3 pt-3">
          <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border-2 border-black">
            <img class="w-12 h-12 rounded border border-black object-cover" src="${provider.image_url}"/>
            <div class="min-w-0 flex-1">
              <h4 class="font-title-md text-on-surface font-bold truncate">${provider.name}, ${provider.credentials}</h4>
              <p class="font-body-sm text-secondary truncate">${provider.specialty}</p>
              <p class="font-label-sm text-outline truncate">${provider.clinic_name}</p>
            </div>
          </div>
          <!-- Slot Picker -->
          <div>
            <label class="font-label-sm uppercase font-bold text-on-surface block mb-1">Select Time Slot</label>
            <div class="grid grid-cols-2 gap-2" id="modal-slot-selector">
              ${(provider.available_slots || ['Tomorrow, 10:30 AM', 'Tomorrow, 2:30 PM']).map((s, idx) => `
                <button type="button" onclick="window.MediSlotApp.selectModalSlot('${s}', this)"
                        class="p-2.5 rounded border-2 border-black text-label-md font-bold text-center transition-all ${idx === 0 ? 'bg-primary-container shadow-[2px_2px_0px_#000000]' : 'bg-surface-container-lowest'}">
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
          <!-- Patient Details -->
          <div>
            <label class="font-label-sm uppercase font-bold text-on-surface block mb-1">Patient Name</label>
            <input id="booking-patient-name" class="w-full p-2 bg-surface rounded border-2 border-black font-body-md" value="Alex Mercer" />
          </div>
          <div>
            <label class="font-label-sm uppercase font-bold text-on-surface block mb-1">Symptom Note (Optional)</label>
            <input id="booking-notes" class="w-full p-2 bg-surface rounded border-2 border-black font-body-sm" placeholder="e.g. Routine checkup, sharp pain..." />
          </div>
          <div class="p-3 bg-primary-container/40 rounded-lg border-2 border-black flex items-center justify-between text-body-sm">
            <span class="font-bold">Estimated Insurance Copay</span>
            <span class="font-headline-sm text-on-surface font-black">$${provider.estimated_copay || 25}.00</span>
          </div>
          <button onclick="window.MediSlotApp.confirmBooking()"
                  class="w-full py-3 bg-primary-container text-on-surface font-label-lg rounded-lg border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-bold uppercase tracking-wider">
            Confirm & Lock Slot
          </button>
        </div>
      `;

      state.selectedSlot = (provider.available_slots || ['Tomorrow, 10:30 AM'])[0];
      modal.classList.remove('hidden');
    },
    selectModalSlot: (slot, btn) => {
      state.selectedSlot = slot;
      const buttons = document.querySelectorAll('#modal-slot-selector button');
      buttons.forEach(b => {
        b.className = 'p-2.5 rounded border-2 border-black text-label-md font-bold text-center transition-all bg-surface-container-lowest';
      });
      btn.className = 'p-2.5 rounded border-2 border-black text-label-md font-bold text-center transition-all bg-primary-container shadow-[2px_2px_0px_#000000]';
    },
    confirmBooking: async () => {
      const provider = state.selectedProvider;
      if (!provider) return;
      const patientName = document.getElementById('booking-patient-name')?.value || 'Alex Mercer';
      const notes = document.getElementById('booking-notes')?.value || '';

      const slotParts = (state.selectedSlot || 'Tomorrow, 2:30 PM').split(',');
      const dateStr = slotParts[0] || 'Tomorrow';
      const timeStr = slotParts[1] ? slotParts[1].trim() : '2:30 PM';

      const newApt = await window.MediSlotDB.bookAppointment({
        patient_name: patientName,
        provider_name: provider.name,
        provider_id: provider.id,
        specialty: provider.specialty,
        clinic_name: provider.clinic_name,
        clinic_address: provider.clinic_address,
        appointment_date: dateStr,
        appointment_time: timeStr,
        copay: provider.estimated_copay || 25.00,
        image_url: provider.image_url,
        notes: notes
      });

      await loadData();
      window.MediSlotApp.closeModal('booking-modal');
      renderAll();
      window.MediSlotApp.openPassModal(newApt.id);
    },
    openPassModal: (aptId) => {
      const apt = state.appointments.find(a => a.id === aptId) || state.appointments[0];
      if (!apt) return;

      const modal = document.getElementById('pass-modal');
      const content = document.getElementById('pass-modal-content');
      if (!modal || !content) return;

      content.innerHTML = `
        <div class="flex items-center justify-between border-b-2 border-black pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[24px]">verified</span>
            <h3 class="font-headline-sm text-on-surface">Digital Medical Pass</h3>
          </div>
          <button onclick="window.MediSlotApp.closeModal('pass-modal')" class="w-8 h-8 rounded border-2 border-black flex items-center justify-center bg-surface-container-lowest font-bold text-[18px]">✕</button>
        </div>
        <div class="pt-4 space-y-4 text-center">
          <!-- QR Code Stamp -->
          <div class="w-44 h-44 mx-auto p-3 bg-surface-container-lowest border-3 border-black rounded-xl shadow-[4px_4px_0px_#000000] flex flex-col items-center justify-center">
            <svg class="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
              <path d="M10 10h30v30h-30zM15 15v20h20v-20zM60 10h30v30h-30zM65 15v20h20v-20zM10 60h30v30h-30zM15 65v20h20v-20zM22 22h6v6h-6zM72 22h6v6h-6zM22 72h6v6h-6zM50 10h5v15h-5zM45 35h15v5h-15zM55 45h5v15h-5zM65 65h10v10h-10zM80 60h10v20h-10zM50 75h10v15h-10zM75 85h15v5h-15z"/>
            </svg>
            <span class="font-label-sm font-black tracking-widest mt-1">${apt.pass_code || 'MS-991204'}</span>
          </div>
          <!-- Info Details -->
          <div class="bg-primary-container p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] text-left space-y-1">
            <div class="flex justify-between items-center">
              <span class="font-label-sm uppercase font-extrabold text-on-surface-variant">Provider</span>
              <span class="font-title-md font-bold text-on-surface">${apt.provider_name}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-label-sm uppercase font-extrabold text-on-surface-variant">Scheduled Time</span>
              <span class="font-label-md font-bold text-on-surface">${apt.appointment_date} · ${apt.appointment_time}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-label-sm uppercase font-extrabold text-on-surface-variant">Clinic Venue</span>
              <span class="font-body-sm font-semibold text-on-surface">${apt.clinic_name}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="alert('Pass saved to Apple/Google Wallet format!')"
                    class="py-2.5 bg-surface-container-lowest text-on-surface font-label-md rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-1 font-bold">
              <span class="material-symbols-outlined text-[16px]">download</span>
              Save to Wallet
            </button>
            <button onclick="window.MediSlotApp.closeModal('pass-modal')"
                    class="py-2.5 bg-primary-container text-on-surface font-label-md rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-bold">
              Done
            </button>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
    },
    openRescheduleModal: (aptId) => {
      const apt = state.appointments.find(a => a.id === aptId);
      if (!apt) return;

      const modal = document.getElementById('booking-modal');
      const content = document.getElementById('booking-modal-content');
      if (!modal || !content) return;

      content.innerHTML = `
        <div class="flex items-center justify-between border-b-2 border-black pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[24px]">swap_horiz</span>
            <h3 class="font-headline-sm text-on-surface">Reschedule Slot</h3>
          </div>
          <button onclick="window.MediSlotApp.closeModal('booking-modal')" class="w-8 h-8 rounded border-2 border-black flex items-center justify-center bg-surface-container-lowest font-bold text-[18px]">✕</button>
        </div>
        <div class="space-y-3 pt-3">
          <p class="font-body-md text-on-surface">Choose a new available slot with <strong>${apt.provider_name}</strong>:</p>
          <div class="space-y-2">
            <button onclick="window.MediSlotApp.confirmReschedule('${apt.id}', 'Tomorrow', '4:00 PM')"
                    class="w-full p-3 bg-surface-container-lowest hover:bg-primary-container rounded-lg border-2 border-black text-left flex justify-between items-center shadow-[2px_2px_0px_#000000]">
              <span class="font-title-sm font-bold">Tomorrow, 4:00 PM</span>
              <span class="font-label-sm bg-surface-container px-2 py-0.5 rounded border border-black">Fastest</span>
            </button>
            <button onclick="window.MediSlotApp.confirmReschedule('${apt.id}', 'Friday, Nov 01', '10:30 AM')"
                    class="w-full p-3 bg-surface-container-lowest hover:bg-primary-container rounded-lg border-2 border-black text-left flex justify-between items-center shadow-[2px_2px_0px_#000000]">
              <span class="font-title-sm font-bold">Friday, Nov 01, 10:30 AM</span>
              <span class="font-label-sm bg-surface-container px-2 py-0.5 rounded border border-black">Morning</span>
            </button>
            <button onclick="window.MediSlotApp.confirmReschedule('${apt.id}', 'Monday, Nov 04', '2:15 PM')"
                    class="w-full p-3 bg-surface-container-lowest hover:bg-primary-container rounded-lg border-2 border-black text-left flex justify-between items-center shadow-[2px_2px_0px_#000000]">
              <span class="font-title-sm font-bold">Monday, Nov 04, 2:15 PM</span>
              <span class="font-label-sm bg-surface-container px-2 py-0.5 rounded border border-black">Next Week</span>
            </button>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
    },
    confirmReschedule: async (aptId, newDate, newTime) => {
      await window.MediSlotDB.rescheduleAppointment(aptId, newDate, newTime);
      await loadData();
      window.MediSlotApp.closeModal('booking-modal');
      renderAll();
      alert(`Appointment successfully rescheduled to ${newDate}, ${newTime}!`);
    },
    cancelAppointment: async (aptId) => {
      if (confirm('Are you sure you want to cancel this appointment? There is zero penalty.')) {
        await window.MediSlotDB.cancelAppointment(aptId);
        await loadData();
        renderAll();
      }
    },
    openProfileModal: (providerId) => {
      const p = state.providers.find(prov => prov.id === providerId);
      if (!p) return;

      const modal = document.getElementById('pass-modal');
      const content = document.getElementById('pass-modal-content');
      if (!modal || !content) return;

      content.innerHTML = `
        <div class="flex items-center justify-between border-b-2 border-black pb-3">
          <h3 class="font-headline-sm text-on-surface">Doctor Profile</h3>
          <button onclick="window.MediSlotApp.closeModal('pass-modal')" class="w-8 h-8 rounded border-2 border-black flex items-center justify-center bg-surface-container-lowest font-bold text-[18px]">✕</button>
        </div>
        <div class="pt-3 space-y-3 text-left">
          <div class="flex gap-3 items-center">
            <img class="w-16 h-16 rounded-xl border-2 border-black object-cover shadow-[2px_2px_0px_#000000]" src="${p.image_url}"/>
            <div>
              <h4 class="font-title-lg font-bold text-on-surface">${p.name}, ${p.credentials}</h4>
              <p class="font-body-sm text-secondary">${p.specialty}</p>
              <div class="flex items-center gap-1 text-primary text-label-sm font-bold mt-0.5">
                <span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">star</span>
                <span>${p.rating} (${p.reviews_count} patient reviews)</span>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-low p-3 rounded-lg border-2 border-black space-y-1 text-body-sm">
            <p><strong>Clinic:</strong> ${p.clinic_name}</p>
            <p><strong>Address:</strong> ${p.clinic_address || 'Central Health Campus'}</p>
            <p><strong>Languages:</strong> ${(p.languages || ['EN']).join(', ')}</p>
            <p><strong>Experience:</strong> ${p.experience_years} years board certified</p>
            <p><strong>Next Slot:</strong> <span class="bg-primary-container px-1 py-0.5 rounded border border-black font-bold">${p.next_opening}</span></p>
          </div>
          <button onclick="window.MediSlotApp.closeModal('pass-modal'); window.MediSlotApp.openBookingModal('${p.id}');"
                  class="w-full py-3 bg-primary-container text-on-surface font-label-lg font-bold rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase">
            Book Appointment with ${p.name.split(' ')[1] || p.name}
          </button>
        </div>
      `;
      modal.classList.remove('hidden');
    },
    openSupabaseModal: () => {
      const modal = document.getElementById('supabase-modal');
      const status = window.MediSlotDB.getStatus();
      const urlInput = document.getElementById('supabase-url-input');
      const keyInput = document.getElementById('supabase-key-input');
      const statusMsg = document.getElementById('supabase-status-message');

      if (urlInput) urlInput.value = status.url || '';
      if (keyInput) keyInput.value = window.MediSlotDB.key || '';
      if (statusMsg) {
        if (status.isLive) {
          statusMsg.className = 'p-3 bg-emerald-100 text-emerald-800 rounded border-2 border-black text-body-sm font-semibold';
          statusMsg.textContent = 'Active Connection: Successfully syncing with your Supabase Cloud PostgreSQL database!';
        } else {
          statusMsg.className = 'p-3 bg-primary-container text-on-surface rounded border-2 border-black text-body-sm';
          statusMsg.textContent = 'Running in Demo Mode on local engine. Enter your Supabase credentials below to connect to your live database.';
        }
      }
      if (modal) modal.classList.remove('hidden');
    },
    saveSupabaseConfig: async () => {
      const url = document.getElementById('supabase-url-input')?.value.trim();
      const key = document.getElementById('supabase-key-input')?.value.trim();
      const statusMsg = document.getElementById('supabase-status-message');

      if (!url || !key) {
        alert('Please provide both Project URL and Public Anon Key.');
        return;
      }

      if (statusMsg) {
        statusMsg.className = 'p-3 bg-surface-container text-on-surface rounded border-2 border-black text-body-sm';
        statusMsg.innerHTML = '<span class="flex items-center gap-2"><span class="material-symbols-outlined animate-spin text-[16px]">sync</span> Testing Supabase connection...</span>';
      }

      const res = await window.MediSlotDB.setCredentials(url, key);
      updateSupabaseStatusBadge();

      if (res.success) {
        if (res.tableMissing) {
          statusMsg.className = 'p-3 bg-amber-100 text-amber-900 rounded border-2 border-black text-body-sm';
          statusMsg.textContent = res.message;
        } else {
          statusMsg.className = 'p-3 bg-emerald-100 text-emerald-800 rounded border-2 border-black text-body-sm font-semibold';
          statusMsg.textContent = res.message;
          setTimeout(async () => {
            await loadData();
            renderAll();
          }, 800);
        }
      } else {
        statusMsg.className = 'p-3 bg-error-container text-on-error-container rounded border-2 border-black text-body-sm';
        statusMsg.textContent = res.message;
      }
    },
    disconnectSupabase: () => {
      window.MediSlotDB.clearCredentials();
      updateSupabaseStatusBadge();
      const statusMsg = document.getElementById('supabase-status-message');
      if (statusMsg) {
        statusMsg.className = 'p-3 bg-primary-container text-on-surface rounded border-2 border-black text-body-sm';
        statusMsg.textContent = 'Disconnected. App returned to high-velocity Local Storage Demo engine.';
      }
      loadData();
      renderAll();
    },
    adminAddSlot: (providerId) => {
      const p = state.providers.find(prov => prov.id === providerId);
      if (!p) return;
      const newSlot = prompt(`Add new slot time for ${p.name} (e.g. "Tomorrow, 5:30 PM"):`, 'Tomorrow, 5:30 PM');
      if (newSlot && newSlot.trim()) {
        p.available_slots = p.available_slots || [];
        p.available_slots.push(newSlot.trim());
        localStorage.setItem('MEDISLOT_PROVIDERS', JSON.stringify(state.providers));
        renderAdmin();
        alert(`Slot added to ${p.name}!`);
      }
    },
    closeModal: (id) => {
      const modal = document.getElementById(id);
      if (modal) modal.classList.add('hidden');
    }
  };

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
