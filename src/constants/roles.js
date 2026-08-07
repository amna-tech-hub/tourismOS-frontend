export const ROLES = {
  TRAVELER: 'traveler',
  COMPANY_ADMIN: 'company_admin',
  EMPLOYEE: 'employee',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_HOME_ROUTES = {
  [ROLES.TRAVELER]: '/traveler/home',
  [ROLES.COMPANY_ADMIN]: '/company/dashboard',
  [ROLES.EMPLOYEE]: '/employee/dashboard',
  [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
};