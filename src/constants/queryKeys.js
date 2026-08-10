export const QUERY_KEYS = {
  COMPANY: {
    ALL: ['company'],
    DASHBOARD: ['company', 'dashboard'],
    PROFILE: ['company', 'profile'],
    CREDIT_HISTORY: ['company', 'credit-history'],
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

    // Security & Analytics
    FRAUD_ATTEMPTS: ['super-admin', 'fraud-attempts'],

    // Dashboard
    DASHBOARD_REVENUE: ['admin', 'dashboard', 'revenue'],
    COMPANY_OVERVIEW: ['admin', 'dashboard', 'company'],
    BOOKING_OVERVIEW: ['admin', 'dashboard', 'booking'],
    PLATFORM_STATS: ['admin', 'dashboard', 'platform-stats'],
  },
  TRAVELER: {
    // Auth & Profile
    PROFILE: ['traveler', 'profile'],
    ALL_TOURS:['tour'],

    // Travel Journals
    MY_JOURNALS: ['traveler', 'journals', 'me'],
    JOURNAL_DETAIL: (id) => ['traveler', 'journals', id],

    // Tour Reviews
    TOUR_REVIEWS: (tourId) => ['traveler', 'reviews', 'tour', tourId],
  },
};