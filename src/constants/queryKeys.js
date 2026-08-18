export const QUERY_KEYS = {
  COMPANY: {
    ALL: ['company'],
    DASHBOARD: ['company', 'dashboard'],
    PROFILE: ['company', 'profile'],
    CREDIT_HISTORY: ['company', 'credit-history'],
    EMPLOYEES: ["company", "employees"],

  EMPLOYEES_LIST: (params) => [
    "company",
    "employees",
    "list",
    params,
  ],

  EMPLOYEE_DETAIL: (employeeId) => [
    "company",
    "employees",
    "detail",
    employeeId,
  ],
  },

  SUPER_ADMIN: {
    // Companies
    COMPANIES: (params) => ['super-admin', 'companies', params],
    COMPANY_DETAIL: (id) => ['super-admin', 'companies', id],
    COMPANY_STATS: (id) => ['super-admin', 'companies', id, 'stats'],

    // Users
    USERS: (params) => ['super-admin', 'users', params],
    USER_DETAIL: (id) => ['super-admin', 'users', id],
    USER_STATS: (id) => ['super-admin', 'users', id, 'stats'],
    ROLES: ['super-admin', 'users', 'roles'],

    // Subscriptions & Plans
    SUBSCRIPTION_PLANS: ['super-admin', 'subscriptions', 'plans'],
    COMPANY_SUBSCRIPTIONS: ['super-admin', 'subscriptions', 'company-ledger'],

    // Security & Analytics
    FRAUD_ATTEMPTS: ['super-admin', 'fraud-attempts'],

    // Dashboard
    DASHBOARD_REVENUE: ['admin', 'dashboard', 'revenue'],
    COMPANY_OVERVIEW: ['admin', 'dashboard', 'company'],
    BOOKING_OVERVIEW: ['admin', 'dashboard', 'booking'],
    PLATFORM_STATS: ['admin', 'dashboard', 'platform-stats'],
    DASHBOARD_ANALYSIS: ['admin', 'dashboard', 'platform-analysis'],
    TOUR_ANALYTICS: ['super-admin', 'tours', 'analytics'],
  },

  TRAVELER: {
    // Auth & Profile
    PROFILE: ['traveler', 'profile'],

    // Tours
    PUBLIC_TOURS: (params) => ['tours', 'public', params],
    COMPANY_TOURS: (params) => ['tours', 'company', params],
    TOUR_BY_ID: (id) => ['tours', id],
    TOUR_DETAILS: (id) => ['tours', 'details', id],
    ALL_TOURS: ['tours', 'all'],
     ADMIN_TOURS: (params) => ['tours', 'admin', params],

    // Travel Journals
    MY_JOURNALS: ['traveler', 'journals', 'me'],
    JOURNAL_DETAIL: (id) => ['traveler', 'journals', id],

    // Tour Reviews
    TOUR_REVIEWS: (tourId) => ['traveler', 'reviews', 'tour', tourId],
  },
};