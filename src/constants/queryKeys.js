export const QUERY_KEYS = {
  COMPANY: {
    ALL: ['company'],
    DASHBOARD: ['company', 'dashboard'],
    PROFILE: ['company', 'profile'],
    CREDIT_HISTORY: ['company', 'credit-history'],
    EMPLOYEES: ["company", "employees"],
    SUBSCRIPTION_PLANS: ["subscription", "plans"],
 BOOKINGS: ["company", "bookings"],
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
     PUBLIC_TOURS_INFINITE: (params = {}) => [
  "public-tours-infinite",
  params,
  
],
  
  BOOKING: {
    MY_BOOKINGS: ['my-bookings'],
    DETAILS: ['booking-details'],
  },
    // Travel Journals
    MY_JOURNALS: ['traveler', 'journals', 'me'],
    JOURNAL_DETAIL: (id) => ['traveler', 'journals', id],
JOURNAL_DETAIL: (id) => ["journal-detail", id],

UPDATE_JOURNAL: (id) => ["update-journal", id],
    // Tour Reviews
    TOUR_REVIEWS: (tourId) => ['traveler', 'reviews', 'tour', tourId],
  },
  EMPLOYEE: {
    // ----- Tours -----
    TOURS: ["employee", "tours"],
    TOURS_LIST: (params) => ["employee", "tours", "list", params],
    TOUR_DETAIL: (id) => ["employee", "tours", "detail", id],

    // ----- Dashboard -----
    DASHBOARD: ["employee", "dashboard"],

    // ----- Bookings -----
    BOOKINGS: ["employee", "bookings"],
    BOOKINGS_LIST: (params) => ["employee", "bookings", "list", params],
    BOOKING_DETAIL: (id) => ["employee", "bookings", "detail", id],
    BOOKING_STATS: ["employee", "bookings", "stats"],

    // ----- Reviews -----
    REVIEWS: ["employee", "reviews"],
    REVIEWS_LIST: (params) => ["employee", "reviews", "list", params],
    RATING_STATS: ["employee", "reviews", "stats"],

    // ----- Profile -----
    PROFILE: ["employee", "profile"],
    COMPANY: ["employee", "company"],
  },
 NOTIFICATION_KEYS : {
  ALL: ["notifications"],
  UNREAD_COUNT: ["notifications", "unread-count"],
}
};