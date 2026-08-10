import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';

// Guard Components
import ProtectedRoute from '../routes/ProtectedRoute';
import RoleRoute from '../routes/RoleRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import TravelerLayout from '../layouts/TravelerLayout';
import PublicLayout from '../layouts/PublicLayout';


// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
// import ForgotPassword from '../pages/auth/ForgotPassword';
// import ResetPassword from '../pages/auth/ResetPassword';

// Public / Traveler Pages
import Home from '../pages/traveler/Home';

// Company Admin Pages
import CompanyDashboard from '../pages/company/CompanyDashboard';


// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';


// Super Admin Pages
import SuperAdminDashboard from '../pages/super-admin/SuperAdminDashboard';


// Shared Pages
import NotFound from '../pages/shared/NotFound';
import Unauthorized from '../pages/shared/Unauthorized';
import DashboardLayout from '../layouts/DashboardLayout';
import CompanyManagement from '../pages/super-admin/CompanyManagement';
import UserManagement from '../pages/super-admin/UserManagement';

export const router = createBrowserRouter([
  // PUBLIC & UNPROTECTED ROUTES

  {
    element: <PublicLayout/>,
    children: [
      { path: '/', element: <Home /> },
   
    ],
  },

  // AUTHENTICATION ROUTES 

  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    //   { path: 'forgot-password', element: <ForgotPassword /> },
    //   { path: 'reset-password', element: <ResetPassword /> },
    ],
  },

  // PROTECTED ROUTES 
  {
    element: <ProtectedRoute />,
    children: [
      // 1. TRAVELER PORTAL
      {
        element: <RoleRoute allowedRoles={[ROLES.TRAVELER]} />,
        children: [
          {
            element: <TravelerLayout/>,
            children: [
              { path: '/traveler/home', element: <Home /> },  
           
            ],
          },
        ],
      },

      // 2. COMPANY ADMIN PORTAL
      {
        element: <RoleRoute allowedRoles={[ROLES.COMPANY_ADMIN]} />,
        children: [
          {
            element: <DashboardLayout portalType="company"/>,
            children: [
              { path: '/company/dashboard', element: <CompanyDashboard /> },
            
            ],
          },
        ],
      },

      // 3. EMPLOYEE PORTAL
      {
        element: <RoleRoute allowedRoles={[ROLES.EMPLOYEE,ROLES.COMPANY_ADMIN]} />,
        children: [
          {
            element: <DashboardLayout portalType="employee" />,
            children: [
              { path: '/employee/dashboard', element: <EmployeeDashboard /> },
            
            ],
          },
        ],
      },

      // 4. SUPER ADMIN PORTAL
      {
        element: <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]} />,
        children: [
          {
            element: <DashboardLayout portalType="super-admin" />,
            children: [
              { path: '/super-admin/dashboard', element: <SuperAdminDashboard /> },
              { path: '/super-admin/companies', element: <CompanyManagement/>},
              { path:  '/super-admin/users', element: <UserManagement/>},

         
          
            ],
          },
        ],
      },
    ],
  },

  // SYSTEM & FALLBACK ROUTES

  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '*', element: <NotFound /> },
]);