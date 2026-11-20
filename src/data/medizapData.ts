import type {
  Appointment,
  Doctor,
  FamilyMember,
  FaqItem,
  Hospital,
  MedicalRecord,
  NotificationPreference,
  SpecialtyItem,
} from '../types/medizap';

export const MEDIZAP_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB0rOisheccj78O_LSNlcAY2xj7Y9cQvXTxj-NVvFWDOu_YnyP78Rtz1Xut5oDIDSSjIUYuU4QkCBd5puQsoIDH2IxNeTyXOl2pvMnQjLOwwFvm4OolUWT8rhBUxPcJ3Hy6v7hcVH7G07P-iBf_ywL6D_xSarM5x4qBelMHgS3_CRIPFzpPovYJtg3x1UvAXzKkxsIhSF8GueMRLjRnJCtYb0Z2O8uAWowMh6EPM5c';

export const HEADER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBv0vRvQybrD0gVepCqtqj0hoyCxCKGnaKbM_wQiruParP60YnROQvkB8HqBczrvMKPLJH9oXHDQeqaqvo2vQZVqmj7k3s9y_j-usEBaKE7ccUQzrsroydCb99Ge3kdRR40EvVQH-jKrga67YccjgcW_hOEy7NLgSQAzaIIslPizfyGKwcL-rCKTQqUAcGQXAiH07CLabOa_s5way9pIUbqu-7YZlKsPlF0p69oSvk';

export const ALEX_MORGAN_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBDM43ZRvsdoFad4rtgd8HKoYw49pRqQGEsqdAUzbAjZ29E0HjaqP9GWo2feS9hyahzW70Gooof48IaxFWVjL8ST0a3hXOq6_BrW8dD2KTlWbSivsZKS-gPz88FeRSvJXGil0Srvk2xSi49IHhMElNZkKXsUoJOLdpEOfDc7AwLUJTTOnZH0tjy0Cg25C2n06GP5ZEwpa2vtbuItefIQKEfgzjwzcObgq44UmtrOh4';

export const HERO_HEART_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrCjw2PGbKBZ0wJdkbirVVVqwBDrLOre02R3nTUUVSeUh0hZzCYht5ll01Yd52D4GdO0qi9cZ2Quig2Cajh80rosL2cho0QI_PiP6Y2EuLgZ0O-XTVTsM6HzJcN4A77WiK4zmWrSY26bs8ewwOpT2445n_SHNC4rhduCBcU4fYSLjRjhzXkirXhuGcKUe1F9Ra264MeUUDBo58vyQ30AzXtPh1DTKwvh3NKvvI0mYeiv';

export const LOCATIONS = [
  'Downtown Metro, NY',
  'North Avenue Medical District',
  'Green Valley Heights',
  'Saint Luke Westside',
  'All Metro Regions',
];

export const SPECIALTIES: SpecialtyItem[] = [
  { id: 'cardiology', name: 'Cardiology', label: 'Cardiology', emoji: '🫀', doctorCount: 142, bgClass: 'bg-blue-100' },
  { id: 'neurology', name: 'Neurology', label: 'Neurology', emoji: '🧠', doctorCount: 88, bgClass: 'bg-purple-100' },
  { id: 'orthopedics', name: 'Orthopedics', label: 'Orthopedics', emoji: '🦴', doctorCount: 114, bgClass: 'bg-orange-100' },
  { id: 'general', name: 'General Physician', label: 'General Phys.', emoji: '🩺', doctorCount: 320, bgClass: 'bg-green-100' },
  { id: 'dentistry', name: 'Dentistry', label: 'Dentistry', emoji: '🦷', doctorCount: 96, bgClass: 'bg-cyan-100' },
  { id: 'ophthalmology', name: 'Ophthalmology', label: 'Ophthalmology', emoji: '👁️', doctorCount: 75, bgClass: 'bg-yellow-100' },
  { id: 'dermatology', name: 'Dermatology', label: 'Dermatology', emoji: '🧴', doctorCount: 105, bgClass: 'bg-pink-100' },
  { id: 'pediatrics', name: 'Pediatrics', label: 'Pediatrics', emoji: '👶', doctorCount: 160, bgClass: 'bg-rose-100' },
  { id: 'pulmonology', name: 'Pulmonology', label: 'Pulmonology', emoji: '🫁', doctorCount: 64, bgClass: 'bg-teal-100' },
  { id: 'oncology', name: 'Oncology', label: 'Oncology', emoji: '🧬', doctorCount: 52, bgClass: 'bg-indigo-100' },
];

export const HOSPITALS: Hospital[] = [
  {
    id: 'apollo',
    name: 'Apollo Care Hospital',
    area: 'Downtown Metro',
    distanceKm: 2.4,
    rating: 4.8,
    reviewsCount: 420,
    badgeText: 'Emergency 24/7',
    badgeVariant: 'tertiary',
    departments: ['Cardiology', 'Neurology', 'Cardiac Cath Lab', 'Telehealth ICU', 'Diagnostic Imaging', 'Trauma ER', 'Pulmonology', 'Endocrinology'],
    extraDepartmentsCount: 6,
    doctorsOnDuty: 32,
    erWaitMinutes: 9,
    icuBedsAvailable: 14,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtuIere7LX-TWCoVI8bZdWuJXMNX_3gYT6ALTZLnye5r5fZES7lXdFhuT-NdGIdTpxy7e-ZnGhaOiaPWj5zTFljeyOopl4yhX9nTDwxEUDC9A3jcSHlwilZif0mZJcdtXqgjloDGA708dswNWoNsUkqriCmjQEhqCengGbMSjsJc_CH48E56kOziTgnFjCKZfpzKvO38FW84_jmTYaAL8_91rAqinuLjfndAXRD9s',
    imageAlt: 'Modern architectural glass facade of Apollo Care hospital',
    address: '420 Lexington Medical Plaza, Downtown Metro',
    phone: '+1 (555) 230-8800',
    accreditations: ['JCI Accredited', 'Level 1 Cardiac Center', '24/7 Trauma Care'],
  },
  {
    id: 'city',
    name: 'City Health Multispeciality',
    area: 'North Avenue',
    distanceKm: 3.8,
    rating: 4.7,
    reviewsCount: 310,
    badgeText: 'NABH Accredited',
    badgeVariant: 'primary',
    departments: ['Dermatology', 'Pediatrics', 'General Physician', 'Allergy & Immunology', 'Maternity', 'Pathology Lab'],
    extraDepartmentsCount: 4,
    doctorsOnDuty: 28,
    erWaitMinutes: 14,
    icuBedsAvailable: 9,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkZC4JW2NkG_tJdll460f_Rk1nw9Y5D7o0AiWv2bM5qZQ4T4-554ylvKDfax-dBVpCvrE7MWJ7HCgiKIme0GVN93F1TJ1AM8umi02aV3eIeoLRDF8dkzKMdeRqUXVN0Yt5VTD8DjYRixHKS1P9erfmxom2EHSBPiO3XTZRHc7RtPRaHGgyue6VoTRzgBwIvTAWBtdxmRQiYGmwSCNgsfSJDeFZexydy1nDesg--VY',
    imageAlt: 'Exterior entrance of City Health Multispeciality center',
    address: '890 North Avenue Clinical Corridor',
    phone: '+1 (555) 391-4420',
    accreditations: ['NABH Certified', 'Pediatric Safe Zone', 'Digital EMR Integrated'],
  },
  {
    id: 'greenlife',
    name: 'GreenLife Medical Center',
    area: 'Green Valley',
    distanceKm: 4.1,
    rating: 4.6,
    reviewsCount: 180,
    badgeText: 'Top Rated Ortho',
    badgeVariant: 'tertiary',
    departments: ['Orthopedics', 'Radiology', 'Sports Rehabilitation', 'Joint Replacement', 'Physiotherapy', 'Neurology', 'Spine Care'],
    extraDepartmentsCount: 5,
    doctorsOnDuty: 19,
    erWaitMinutes: 11,
    icuBedsAvailable: 11,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDMCWZfATC5IASRf0SEUtshwaO3t6tUA1CUfIinDpiiA_WVWyeXYwbkWw3t-UNd5RDxuC6xLoPSIb11_BC73OfG4eIfLWpkfcino0sZ-S-D4fWI04dcddHfzpIwo4OzvKv9PGOwQ3UkTNXe8Dii5JWNp0fDarQSyuEjDpkD5_TrOiKcWE-a0NH6AZD-oliWlMd2R7XnY_QMpLktqbzgXtkBtYNQbz7aiUkwWdK2pQ8',
    imageAlt: 'Architectural view of GreenLife Medical Center with courtyard gardens',
    address: '155 Green Valley Parkway, East Wing',
    phone: '+1 (555) 742-1190',
    accreditations: ['Center of Excellence: Orthopedics', 'ISO 9001 Imaging', 'Eco-Clinical Campus'],
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-michael-oconnell',
    name: "Dr. Michael E. O'Connell",
    specialty: 'Cardiology',
    subSpecialty: 'Cardiology',
    credentials: 'MD, DM Cardiology, FACC • Fellow of Cardiology',
    experienceYears: 16,
    rating: 4.9,
    reviewsCount: 340,
    hospitalId: 'apollo',
    hospitalName: 'Apollo Care Heart Institute',
    distanceKm: 2.5,
    fee: 60,
    nextSlot: 'Today, 03:00 PM',
    nextSlotUrgency: 'today',
    availableToday: true,
    availableWeekend: true,
    telehealthReady: true,
    capabilities: ['Telehealth Available', 'In-house ECG'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWyIlaQhoQSWsVo3FDblzdd5cfXm35Fabgi8bKyJ3uQsfxXwGt-9BriHHee4njBKoXlFg_NPL68UR_1yVLheRFUKNb7HmvwzMpm8fbU4qk4Uu_ZRNOQ5WO4uzIZD3i-CpEJ5zruop2A3c5NXydbobhv-AiDQuuJ2K2wLG65dJg5M0qk1M-ihIpl5NY1-T3p76-5mrLgUr_1PZtx3_hFmXOFvVoPXIGBXqKJa6PxuM',
    imageAlt: "Portrait of Dr. Michael E. O'Connell",
    bio: 'Senior clinical cardiologist specializing in preventive lipid management, non-invasive echocardiography, and arrhythmia triage.',
    languages: ['English', 'Spanish'],
    education: 'Johns Hopkins School of Medicine',
  },
  {
    id: 'dr-arjun-kumar',
    name: 'Dr. Arjun Kumar',
    specialty: 'Cardiology',
    subSpecialty: 'Interventional Cardiology',
    credentials: 'MD, DM, FSCAI • Angioplasty Specialist',
    experienceYears: 20,
    rating: 4.9,
    reviewsCount: 420,
    hospitalId: 'apollo',
    hospitalName: 'Apollo Care Hospital',
    distanceKm: 2.4,
    fee: 60,
    nextSlot: 'Today, 04:30 PM',
    nextSlotUrgency: 'today',
    availableToday: true,
    availableWeekend: false,
    telehealthReady: true,
    capabilities: ['Cath Lab Certified', 'Telehealth Available'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgV4W71AdzEZBnUCyXKzCiZpat-Qpz7EdsdhsMDNCwaKa_s2rl2j-xWKFqd5gWzkkBUw73RpK5kOE9SOyqb_eocKFJDCs3zYerlZ7QzI1xOt9OdEFi1r46ouaedBnq4Q-hX3uLm1EhdPNEIEmG43J1lXTIYCMHRSCqa7VcpR44bGdPm6LOXn8gKlV3HaWRwq5hSgsRK2uL6joTR4JD7s8raolsYf4f4QyYFgX4h6E',
    imageAlt: 'Portrait of Dr. Arjun Kumar, cardiologist',
    bio: 'Chief Cardiologist & Interventional Cardiology Fellow leading the Heart Wellness Pavilion at Apollo Care Hospital.',
    languages: ['English', 'Hindi'],
    education: 'All India Institute of Medical Sciences & Cleveland Clinic',
  },
  {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatology',
    subSpecialty: 'Clinical & Cosmetic Dermatology',
    credentials: 'MD, FAAD • Skin & Allergy Specialist',
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 280,
    hospitalId: 'city',
    hospitalName: 'City Health Multispeciality',
    distanceKm: 3.8,
    fee: 50,
    nextSlot: 'Tomorrow, 10:00 AM',
    nextSlotUrgency: 'tomorrow',
    availableToday: false,
    availableWeekend: true,
    telehealthReady: true,
    capabilities: ['Telehealth Available', 'Patch Testing'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2oLoBaTAaRGDSwoKOoCRzpMX1-kK62jUQi1XgJecSJir7g1aGHx-YbI_8DxRXvjDm6NLBVTbBE-E0aCGf6GLFAgx9ixZBZmTJBA5fHVCxb6wv5IYT5dz3gcNwknw0VjFWRe-gYONGjqm7Yk3bk_8HfgOkbluSgtMM0f3BgIRHlwN9hbyNE5UUeq4PiGtYDOQghnP3BNh2bBLzT6weNlRa-3J0-8JJqxWspGV-nJc',
    imageAlt: 'Portrait of Dr. Priya Sharma, dermatologist',
    bio: 'Board-certified dermatologist focused on eczema, autoimmune skin conditions, acne protocols, and dermoscopic screenings.',
    languages: ['English', 'Hindi'],
    education: 'Stanford University School of Medicine',
  },
  {
    id: 'dr-rahul-menon',
    name: 'Dr. Rahul Menon',
    specialty: 'Orthopedics',
    subSpecialty: 'Orthopedic Specialist',
    credentials: 'MS Ortho, FACS • Joint & Sports Trauma',
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 315,
    hospitalId: 'greenlife',
    hospitalName: 'GreenLife Medical Center',
    distanceKm: 4.1,
    fee: 75,
    nextSlot: 'Today, 02:00 PM',
    nextSlotUrgency: 'today',
    availableToday: true,
    availableWeekend: true,
    telehealthReady: false,
    capabilities: ['Digital X-Ray Suite', 'Sports Rehab'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDW3-jvQPrFyd4tUVz40QXo7yU589Q5ld9XlDqzgfDlwQrFEKS1DK1jT4nVpJha849gV6FfJq5PRQRvNcn-kMw2KoyJyfQyGmFMtEq_gj0dWzFk-Pe-yq-Y9EzLxKfgb-dit4vv8Pb7iPF9AyrYdMSG06NubQUqtQsP8HlNfRX1ZXTYgbtJr5vi_8oaxGVfKO3_xTdszS1Rco4nlPV-PMR3pXYmjJfV98wq-Et8eY',
    imageAlt: 'Portrait of Dr. Rahul Menon, orthopedic specialist',
    bio: 'Senior orthopedic surgeon specializing in minimally invasive knee arthroscopy, rotator cuff repair, and sports trauma recovery.',
    languages: ['English', 'Malayalam'],
    education: 'Harvard Medical School Orthopedic Residency',
  },
  {
    id: 'dr-elena-rostova',
    name: 'Dr. Elena Rostova',
    specialty: 'Neurology',
    subSpecialty: 'Neurology & Pediatric Care',
    credentials: 'MD, PhD, FACC • Clinical Neurology Triage',
    experienceYears: 14,
    rating: 4.8,
    reviewsCount: 215,
    hospitalId: 'apollo',
    hospitalName: 'Saint Luke Neurological Center',
    distanceKm: 5.8,
    fee: 65,
    nextSlot: 'Today, 05:15 PM',
    nextSlotUrgency: 'today',
    availableToday: true,
    availableWeekend: true,
    telehealthReady: true,
    capabilities: ['Video & Clinic', 'EEG Lab'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD958vvVO78TOup0XgT7nxRKB-29IgveKuWnVtfuPoPiANrSj_E1xP7RMJr_V3JmKArjp6bE1F_Qtruke13SlJ4JQnSrI4X5SzD6idD6kYQzg4vOclaDEZqXIfr5GP_LhgOnxxMTYmDCB-oTDmcngguvHsbz75jg6tyIWtIcE7bjyoUTDWqNHP42fypBO7tlzio6dcfbR-2t0NLR1QZIjo0-PB4neCAIYazc0Hh0CQ',
    imageAlt: 'Portrait of Dr. Elena Rostova, neurologist',
    bio: 'Specialist in migraine pathways, outpatient neurological triage, and pediatric autonomic disorders.',
    languages: ['English', 'Russian'],
    education: 'Columbia University Vagelos College',
  },
  {
    id: 'dr-sarah-jenkins',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Dermatology',
    subSpecialty: 'Dermatology & Allergy',
    credentials: 'MD, DABD • Clinical Allergist',
    experienceYears: 11,
    rating: 4.8,
    reviewsCount: 264,
    hospitalId: 'city',
    hospitalName: 'Metro Health Medical Center',
    distanceKm: 3.2,
    fee: 55,
    nextSlot: 'Tomorrow, 02:15 PM',
    nextSlotUrgency: 'tomorrow',
    availableToday: false,
    availableWeekend: true,
    telehealthReady: true,
    capabilities: ['Telehealth Available', 'Allergy Panel'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeSi8AAjXVdxQoSSPd_6EpndqIU-gqvDKeA2SI05x9vjvkWxC38ZvbuFb8wyU7fnkKpQdi-YpRQYVYNrVBmx-pCWeEfZTFkb6vQOL2bBdd5Ti9fwMDXq2ZgsyfBSxo6tY92Ge-I48xTrXuvNAhgm0qIEQP8DaG97a7Kj_EYVB_ZWWCyloeDDgWOXWcafxVPa4wzkDNRg01qeWA8x9UmjJ8uzR_JKJ2ipPryYL0JUI',
    imageAlt: 'Portrait of Dr. Sarah Jenkins',
    bio: 'Specializes in seasonal atopic dermatitis, urticaria, and chronic environmental allergy desensitization.',
    languages: ['English'],
    education: 'Yale School of Medicine',
  },
  {
    id: 'dr-marcus-vance',
    name: 'Dr. Marcus Vance',
    specialty: 'Orthopedics',
    subSpecialty: 'Orthopedics & Sports Injury',
    credentials: 'MD, FAAOS • Sports Medicine Director',
    experienceYears: 18,
    rating: 4.7,
    reviewsCount: 195,
    hospitalId: 'greenlife',
    hospitalName: 'GreenLife Medical Center',
    distanceKm: 4.1,
    fee: 70,
    nextSlot: 'Tomorrow, 11:00 AM',
    nextSlotUrgency: 'tomorrow',
    availableToday: false,
    availableWeekend: false,
    telehealthReady: true,
    capabilities: ['Physiotherapy Plan', 'Video Follow-up'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChnbHoTrLJlFwPLpjT7Xvry43M_PsGsU9fSFkkxe4Qdq-bepTiqH5s-RS3m4lYwt67tZMhsPmpsynh9lFlYgRWoRBVo2B8gW6Ot8p5LEyjAJzI3mH3R9bUzYRi-3JpmJbiovly4PgLWDU566DA3RkL9Sf3bNwNzE65-KdYE0QsGd58O1ARoX3gENDOvOmlx9Sj0IoMzUjDnhRKG0eSeIXNLWkbHoYT_Zi79eYq0SQ',
    imageAlt: 'Portrait of Dr. Marcus Vance',
    bio: 'Focuses on tendon rehabilitation, patellar biomechanics, and non-surgical musculoskeletal recovery.',
    languages: ['English', 'French'],
    education: 'UCSF School of Medicine',
  },
  {
    id: 'dr-ananya-desai',
    name: 'Dr. Ananya Desai',
    specialty: 'General Physician',
    subSpecialty: 'Internal Medicine & Primary Care',
    credentials: 'MD, FACP • Family & Preventive Medicine',
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 390,
    hospitalId: 'city',
    hospitalName: 'City Health Multispeciality',
    distanceKm: 3.8,
    fee: 45,
    nextSlot: 'Today, 04:00 PM',
    nextSlotUrgency: 'today',
    availableToday: true,
    availableWeekend: true,
    telehealthReady: true,
    capabilities: ['Telehealth Available', 'Same-Day Labs'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjjB2krLeoGaHH4jYquHJZOyx7tTBgvg0pKFGsdgWt6rP92JvTD6BVADpDnScQGVsahHupcOjw0btCMO9JAHS_b68i7bn9fzlTQKVr12m2-vjnqnX4N8pf9rMHcRMh_UzAAD7_OGJfAWt41oOnrUew3NZ1kp2sXlx9fbidUWeIvBM0Dug--JIrR_LVWajpJ0RnlIj5v-IrWgJjLP4D48NnxGbT7JtKxv4JmDQmvjw',
    imageAlt: 'Portrait of Dr. Ananya Desai, General Physician',
    bio: 'Comprehensive primary care physician focusing on metabolic screenings, hypertension care, and acute respiratory triage.',
    languages: ['English', 'Hindi', 'Gujarati'],
    education: 'NYU Grossman School of Medicine',
  },
  {
    id: 'dr-claire-bennett',
    name: 'Dr. Claire Bennett',
    specialty: 'Pediatrics',
    subSpecialty: 'Pediatrics & Adolescent Care',
    credentials: 'MD, FAAP • Board Certified Pediatrician',
    experienceYears: 13,
    rating: 4.9,
    reviewsCount: 312,
    hospitalId: 'city',
    hospitalName: 'City Health Multispeciality',
    distanceKm: 3.8,
    fee: 55,
    nextSlot: 'Today, 05:30 PM',
    nextSlotUrgency: 'today',
    availableToday: true,
    availableWeekend: true,
    telehealthReady: true,
    capabilities: ['Telehealth Available', 'Pediatric Safe Zone'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ItRRjHsAw9Pklse24Derx7NEahh7ozkxbo1zNqGlJPfAOBv34mbDhaYHBzB2a7cabf0GXPvCBRFAmTfne169jY4Q32HCZ-P1bqtdlhJHePHojt8luTRzOK2iEtkUUIkLsW0Clzj6pwcCMlnD4gwhFD18BauzzxOH_YLZWnmFzgOZMoCtOAIckjACWVGIVmZ8_9SCo0N4uQFqLywm3BQf6AvYhxvcDI4grThv7Wk',
    imageAlt: 'Portrait of Dr. Claire Bennett, Pediatrician',
    bio: 'Dedicated pediatrician specializing in childhood immunizations, developmental milestones, and same-day pediatric fever consults.',
    languages: ['English'],
    education: 'Boston Children’s Hospital / Harvard Medical School',
  },
  {
    id: 'dr-daniel-park',
    name: 'Dr. Daniel Park',
    specialty: 'Dentistry',
    subSpecialty: 'Restorative & Cosmetic Dentistry',
    credentials: 'DDS, FAGD • Digital Implantology',
    experienceYears: 10,
    rating: 4.8,
    reviewsCount: 228,
    hospitalId: 'apollo',
    hospitalName: 'Apollo Care Hospital',
    distanceKm: 2.4,
    fee: 50,
    nextSlot: 'Tomorrow, 09:30 AM',
    nextSlotUrgency: 'tomorrow',
    availableToday: false,
    availableWeekend: true,
    telehealthReady: true,
    capabilities: ['3D CBCT Scan', 'Pain-Free Care'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdwF49ANVk4jKO2C-hpow0tJaVX2RJ280jgo0EbMMeM_KmG9HuLO4aSf7Wxts1AxWg14bXiW0ue5loZSdHh_H-L7zAWyT1y4gITnP_bjm_B84azt-CbUAju1kW-4Ce4zJ868f6RLsmfQQncc2OnTaKtpj5Dw0LXfNkhngOWhKISWAQGTpeltT6gpSwl-sDfCpxc6tC2sWvH5t3nh1QuJxXa2mr5jfx3zKKLVtkZlI',
    imageAlt: 'Portrait of Dr. Daniel Park, Dentist',
    bio: 'Specialist in minimally invasive restorative dentistry, emergency toothache relief, and digital smile alignment.',
    languages: ['English', 'Korean'],
    education: 'University of Pennsylvania School of Dental Medicine',
  },
  {
    id: 'dr-meera-iyer',
    name: 'Dr. Meera Iyer',
    specialty: 'Ophthalmology',
    subSpecialty: 'Retina & LASIK Specialist',
    credentials: 'MD, FRCS • Ophthalmic Microsurgeon',
    experienceYears: 14,
    rating: 4.9,
    reviewsCount: 274,
    hospitalId: 'apollo',
    hospitalName: 'Apollo Care Hospital',
    distanceKm: 2.4,
    fee: 65,
    nextSlot: 'Today, 06:00 PM',
    nextSlotUrgency: 'today',
    availableToday: true,
    availableWeekend: false,
    telehealthReady: true,
    capabilities: ['OCT Retinal Scan', 'Telehealth Available'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2oLoBaTAaRGDSwoKOoCRzpMX1-kK62jUQi1XgJecSJir7g1aGHx-YbI_8DxRXvjDm6NLBVTbBE-E0aCGf6GLFAgx9ixZBZmTJBA5fHVCxb6wv5IYT5dz3gcNwknw0VjFWRe-gYONGjqm7Yk3bk_8HfgOkbluSgtMM0f3BgIRHlwN9hbyNE5UUeq4PiGtYDOQghnP3BNh2bBLzT6weNlRa-3J0-8JJqxWspGV-nJc',
    imageAlt: 'Portrait of Dr. Meera Iyer, Ophthalmologist',
    bio: 'Ophthalmologist focused on glaucoma screening, diabetic eye evaluations, and refractive laser vision consultations.',
    languages: ['English', 'Tamil'],
    education: 'Wilmer Eye Institute, Johns Hopkins',
  },
  {
    id: 'dr-lucas-fernandez',
    name: 'Dr. Lucas Fernandez',
    specialty: 'Pulmonology',
    subSpecialty: 'Respiratory & Sleep Medicine',
    credentials: 'MD, FCCP • Pulmonary Critical Care',
    experienceYears: 15,
    rating: 4.8,
    reviewsCount: 189,
    hospitalId: 'apollo',
    hospitalName: 'Apollo Care Hospital',
    distanceKm: 2.4,
    fee: 70,
    nextSlot: 'Tomorrow, 11:30 AM',
    nextSlotUrgency: 'tomorrow',
    availableToday: false,
    availableWeekend: true,
    telehealthReady: true,
    capabilities: ['Spirometry Lab', 'Telehealth Available'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXjWZpFrWpxXqPvz6MY42YqIg7bItp5STwcgdbnZeAdOp8GhMwwcGScI2t9zI6zRa-n1vptWxajLrnu-yo09S5WmTITm0kaDBtZxNofJuSBljY7ogtkHxOh1-eUPA5l9wyldoZetaepFlWiDDWw_4FNxaE7Slr2CO25FCw5sUUL28eCqf-SRNuZSTYoKjfrIFpwMFik9PRBWF8uhxCwKkw-R62c6PM1gei-e7S2tI',
    imageAlt: 'Portrait of Dr. Lucas Fernandez, Pulmonologist',
    bio: 'Leads asthma, COPD, chronic cough, and sleep apnea diagnostics with integrated home sleep monitoring.',
    languages: ['English', 'Spanish'],
    education: 'Mayo Clinic Alix School of Medicine',
  },
  {
    id: 'dr-hannah-lin',
    name: 'Dr. Hannah Lin',
    specialty: 'Oncology',
    subSpecialty: 'Medical Oncology & Precision Care',
    credentials: 'MD, PhD • Hematology & Oncology',
    experienceYears: 17,
    rating: 4.9,
    reviewsCount: 245,
    hospitalId: 'greenlife',
    hospitalName: 'GreenLife Medical Center',
    distanceKm: 4.1,
    fee: 90,
    nextSlot: 'Tomorrow, 02:00 PM',
    nextSlotUrgency: 'tomorrow',
    availableToday: false,
    availableWeekend: false,
    telehealthReady: true,
    capabilities: ['Tumor Board Review', 'Video & Clinic'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARes7672y8pghQTH_xi2lI-xGvOfpXXHQ6k9h6RXylu1KDi18ZmTq0seXmdtu1YyQtr7e-sEI-o8FBI-y7l6aouMQ2_O17GiyT_3V06ldzZm-VTQTsob6-88owfICe7oPybPNY_XS8rkVJFBcHmRL7gcM_jxg8-BKrvV8nluRwa9thuULjwZYi2HmFERudjBxjDksFRYQlZIWzxm5Uo3BnBTRPL8RP2P6cYbFclb0',
    imageAlt: 'Portrait of Dr. Hannah Lin, Oncologist',
    bio: 'Precision oncology specialist providing second-opinion genomic reviews, biomarker counseling, and coordinated care pathways.',
    languages: ['English', 'Mandarin'],
    education: 'Memorial Sloan Kettering / Weill Cornell',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-9204',
    bookingCode: '#HC-9204',
    doctorId: 'dr-arjun-kumar',
    doctorName: 'Dr. Arjun Kumar',
    doctorTitle: 'Chief Cardiologist • Interventional Cardiology Fellow',
    doctorSpecialty: 'Cardiology',
    doctorImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgV4W71AdzEZBnUCyXKzCiZpat-Qpz7EdsdhsMDNCwaKa_s2rl2j-xWKFqd5gWzkkBUw73RpK5kOE9SOyqb_eocKFJDCs3zYerlZ7QzI1xOt9OdEFi1r46ouaedBnq4Q-hX3uLm1EhdPNEIEmG43J1lXTIYCMHRSCqa7VcpR44bGdPm6LOXn8gKlV3HaWRwq5hSgsRK2uL6joTR4JD7s8raolsYf4f4QyYFgX4h6E',
    hospitalName: 'Apollo Care Hospital',
    hospitalWing: 'Heart Wellness Pavilion, Wing B-3',
    dateLabel: 'Tomorrow, Oct 24',
    isoDate: '2026-11-19',
    timeSlot: '09:30 AM',
    durationMinutes: 45,
    mode: 'Telehealth Video',
    status: 'Confirmed',
    patientName: 'Alex Morgan',
    patientPhone: '+1 (555) 438-9921',
    reason: 'Annual cardiac wellness & blood lipid review',
    fee: 60,
    prepNote: 'Please fast 4 hours prior for blood lipid baseline tests. Bring past ECG graphs.',
  },
  {
    id: 'apt-8831',
    bookingCode: '#HC-8831',
    doctorId: 'dr-sarah-jenkins',
    doctorName: 'Dr. Sarah Jenkins',
    doctorTitle: 'Clinical Dermatologist & Allergist',
    doctorSpecialty: 'Dermatology & Allergy',
    doctorImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeSi8AAjXVdxQoSSPd_6EpndqIU-gqvDKeA2SI05x9vjvkWxC38ZvbuFb8wyU7fnkKpQdi-YpRQYVYNrVBmx-pCWeEfZTFkb6vQOL2bBdd5Ti9fwMDXq2ZgsyfBSxo6tY92Ge-I48xTrXuvNAhgm0qIEQP8DaG97a7Kj_EYVB_ZWWCyloeDDgWOXWcafxVPa4wzkDNRg01qeWA8x9UmjJ8uzR_JKJ2ipPryYL0JUI',
    hospitalName: 'Metro Health Medical Center',
    hospitalWing: 'Derma Suite #408',
    dateLabel: 'Oct 28, 2026',
    isoDate: '2026-11-28',
    timeSlot: '02:15 PM',
    durationMinutes: 30,
    mode: 'In-Clinic Visit',
    status: 'Confirmed',
    patientName: 'Alex Morgan',
    patientPhone: '+1 (555) 438-9921',
    reason: '6-week dermatology follow-up & patch check',
    fee: 55,
    prepNote: 'Avoid applying topical creams 12 hours prior to skin exam.',
  },
  {
    id: 'apt-8740',
    bookingCode: '#HC-8740',
    doctorId: 'dr-elena-rostova',
    doctorName: 'Dr. Elena Rostova',
    doctorTitle: 'Senior Clinical Neurologist',
    doctorSpecialty: 'Neurology Triage',
    doctorImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjPx6lqvMcjhXmwD26viusjVVBwYLLYPSIjN4UqKyfErs0om2r7PCzOy-oknvQ62GqBfHKEjXa7OaAVC8sji621VXnpF4SiGpkL9OZb4M4yC6FxuWCHuvNTAuayxASgiUk-qFZUjbYZW5lOrq6bWwSrO_HELLN2NPaU96LuKAiv1_1mpma5Uh53haAZHMybUJi8W5n1ApQE5WMwB-o6bDfjeoiny8bSa7NBioGUQw',
    hospitalName: 'Saint Luke Neurological Center',
    hospitalWing: 'Outpatient Tower Room 12',
    dateLabel: 'Nov 04, 2026',
    isoDate: '2026-12-04',
    timeSlot: '11:00 AM',
    durationMinutes: 60,
    mode: 'In-Clinic Visit',
    status: 'Pending Slot',
    patientName: 'Alex Morgan',
    patientPhone: '+1 (555) 438-9921',
    reason: 'Migraine frequency evaluation',
    fee: 65,
    prepNote: 'Bring headache log from the last 14 days.',
  },
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-44910',
    doctorId: 'dr-sarah-jenkins',
    doctorName: 'Dr. Sarah Jenkins',
    doctorImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjjB2krLeoGaHH4jYquHJZOyx7tTBgvg0pKFGsdgWt6rP92JvTD6BVADpDnScQGVsahHupcOjw0btCMO9JAHS_b68i7bn9fzlTQKVr12m2-vjnqnX4N8pf9rMHcRMh_UzAAD7_OGJfAWt41oOnrUew3NZ1kp2sXlx9fbidUWeIvBM0Dug--JIrR_LVWajpJ0RnlIj5v-IrWgJjLP4D48NnxGbT7JtKxv4JmDQmvjw',
    service: 'Dermatology Routine Screening',
    visitDate: 'Sep 14, 2025',
    rxId: '#RX-44910',
    diagnosis: 'Dx: Mild Seasonal Atopic Dermatitis',
    prescription: 'Prescribed: Hydrocortisone Topical 1%, Cetirizine 10mg daily. Follow-up suggested in 6 weeks.',
    hospitalName: 'Metro Health Medical Center',
  },
  {
    id: 'rec-39201',
    doctorId: 'dr-marcus-vance',
    doctorName: 'Dr. Marcus Vance',
    doctorImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChnbHoTrLJlFwPLpjT7Xvry43M_PsGsU9fSFkkxe4Qdq-bepTiqH5s-RS3m4lYwt67tZMhsPmpsynh9lFlYgRWoRBVo2B8gW6Ot8p5LEyjAJzI3mH3R9bUzYRi-3JpmJbiovly4PgLWDU566DA3RkL9Sf3bNwNzE65-KdYE0QsGd58O1ARoX3gENDOvOmlx9Sj0IoMzUjDnhRKG0eSeIXNLWkbHoYT_Zi79eYq0SQ',
    service: 'Orthopedics & Sports Injury',
    visitDate: 'Aug 02, 2025',
    rxId: '#RX-39201',
    diagnosis: 'Dx: Right Patellar Tendon Strain',
    prescription: 'Prescribed: Physiotherapy regimen 2x weekly, NSAID gel PRN. Cleared for light jogging.',
    hospitalName: 'GreenLife Medical Center',
  },
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Alex Morgan',
    relation: 'Self (Primary)',
    age: 34,
    bloodGroup: 'O+',
    memberId: '#HC-88219',
    primaryPhysician: 'Dr. Arjun Kumar',
  },
  {
    id: 'fam-2',
    name: 'Maya Morgan',
    relation: 'Spouse',
    age: 32,
    bloodGroup: 'A+',
    memberId: '#HC-88220',
    primaryPhysician: 'Dr. Priya Sharma',
  },
  {
    id: 'fam-3',
    name: 'Leo Morgan',
    relation: 'Son',
    age: 7,
    bloodGroup: 'O+',
    memberId: '#HC-88221',
    primaryPhysician: 'Dr. Elena Rostova',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationPreference[] = [
  {
    id: 'notif-reminders',
    title: 'Appointment Reminders (24h & 2h before)',
    description: 'Automated dispatch confirmations prior to clinic or video consultations.',
    sms: true,
    email: true,
    push: true,
  },
  {
    id: 'notif-rx',
    title: 'Digital Prescriptions & Lab Results',
    description: 'Instant alerts when your doctor uploads clinical summaries or lab reports.',
    sms: false,
    email: true,
    push: true,
  },
  {
    id: 'notif-slots',
    title: 'Waitlist & Earlier Slot Openings',
    description: 'Get notified if an earlier slot becomes available with your selected specialist.',
    sms: true,
    email: false,
    push: true,
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I book an appointment on Healthcare?',
    answer:
      'Booking takes less than 60 seconds: search by doctor specialty or your preferred hospital, select an available date and time slot chip, confirm your contact details, and receive an instant SMS and calendar invitation.',
  },
  {
    id: 'faq-2',
    question: 'What is the appointment cancellation policy?',
    answer:
      'You can reschedule or cancel any appointment free of charge up to 2 hours prior to the scheduled time. If an upfront consultation deposit was charged, it is refunded automatically to your original payment method.',
  },
  {
    id: 'faq-3',
    question: 'How are doctors verified on Healthcare?',
    answer:
      'Every clinical practitioner undergoes a rigorous 4-step credentialing audit verifying board registrations, hospital affiliations, state medical licenses, and peer malpractice history before listing.',
  },
  {
    id: 'faq-4',
    question: 'Can I select between in-person and telehealth consultations?',
    answer:
      "Yes. When selecting your slot, toggle between 'In-Clinic Visit' and 'Telehealth Video'. Telehealth consultations link directly into your secure Healthcare patient portal with no third-party software required.",
  },
  {
    id: 'faq-5',
    question: 'Where can I view my appointment history and clinical notes?',
    answer:
      "Navigate to the 'My Appointments' tab in the top navigation bar. Here, you will find active passes, digital prescriptions, lab orders, and previous doctor consultation summaries stored under HIPAA compliance.",
  },
  {
    id: 'faq-6',
    question: 'How does the Healthcare AI Virtual Assistant work?',
    answer:
      "Healthcare AI leverages specialized clinical language models trained on symptom taxonomies. It parses natural conversational inputs (such as 'sharp back pain radiating down leg') and suggests the precise specialty, nearest accredited hospital, and helps book the next opening.",
  },
];

export const WEEK_DAYS = [
  { id: 'mon-24', day: 'Mon', dateNum: '24', label: 'Mon, Mar 24', statusColor: 'bg-outline-variant' },
  { id: 'tue-25', day: 'Tue', dateNum: '25', label: 'Tue, Mar 25', statusColor: 'bg-primary-fixed' },
  { id: 'wed-26', day: 'Wed', dateNum: '26', label: 'Wed, Mar 26', statusColor: 'bg-tertiary' },
  { id: 'thu-27', day: 'Thu', dateNum: '27', label: 'Thu, Mar 27', statusColor: 'bg-tertiary' },
  { id: 'fri-28', day: 'Fri', dateNum: '28', label: 'Fri, Mar 28', statusColor: 'bg-outline-variant' },
];

export const DAY_SHIFT_SLOTS = {
  morning: [
    { time: '09:00 AM', disabled: false },
    { time: '09:30 AM', disabled: false },
    { time: '10:00 AM', disabled: true },
    { time: '11:30 AM', disabled: false },
  ],
  afternoon: [
    { time: '02:00 PM', disabled: false },
    { time: '03:00 PM', disabled: false },
    { time: '04:30 PM', disabled: false },
    { time: '05:00 PM', disabled: true },
  ],
  evening: [
    { time: '06:00 PM', disabled: false },
    { time: '06:30 PM', disabled: false },
  ],
};

export function downloadCalendarInvite(appt: {
  title: string;
  location: string;
  description: string;
  bookingCode: string;
  dateLabel: string;
  timeSlot: string;
}) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Healthcare//Clinical Scheduling//EN',
    'BEGIN:VEVENT',
    `UID:${appt.bookingCode.replace('#', '')}@healthcare.health`,
    `SUMMARY:${appt.title}`,
    `LOCATION:${appt.location}`,
    `DESCRIPTION:${appt.description} (${appt.dateLabel} at ${appt.timeSlot})`,
    'DTSTART:20261119T093000Z',
    'DTEND:20261119T101500Z',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `healthcare-${appt.bookingCode.replace('#', '').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadDocumentSlip(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
