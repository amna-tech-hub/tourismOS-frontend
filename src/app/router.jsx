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
import DashboardLayout from '../layouts/DashboardLayout';
import RootLayout from '../components/RootLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyOtp from '../pages/auth/VerifyOtp';
import ResetPassword from '../pages/auth/ResetPassword';

// Public / Traveler Pages
import Home from '../pages/traveler/Home';
import About from '../pages/traveler/About';
import MyBookings from '../pages/traveler/MyBookings';
import BookingDetails from '../pages/traveler/BookingDetails';
import Journal from '../pages/traveler/Journal';
import TravelerProfile from '../pages/traveler/TravelerProfile';

// Company Admin Pages
import CompanyDashboard from '../pages/company/CompanyDashboard';
import CompanyTour from '../pages/company/CompanyTour';
import CompanySubscription from '../pages/company/CompanySubscription';
import Employees from '../pages/company/Employees';
import CompanyProfile from '../pages/company/Profile';
import CompanyBookings from '../pages/company/CompanyBookings';

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmpTours from "../pages/employee/Tours";
import EmpBookings from "../pages/employee/Bookings";
import EmpReviews from "../pages/employee/Reviews";
import EmpProfile from "../pages/employee/Profile";

// Super Admin Pages
import SuperAdminDashboard from '../pages/super-admin/SuperAdminDashboard';
import CompanyManagement from '../pages/super-admin/CompanyManagement';
import UserManagement from '../pages/super-admin/UserManagement';
import Analysis from '../pages/super-admin/Analysis';
import Subscriptions from '../pages/super-admin/Subscriptions';
import Tours from '../pages/super-admin/Tours';

// Shared Pages
import NotFound from '../pages/shared/NotFound';
import Unauthorized from '../pages/shared/Unauthorized';
import PaymentSuccessPage from '../pages/shared/PaymentSuccessPage';
import AcceptInvite from '../pages/shared/AcceptInvite';
import TourDetail from '../pages/shared/tours/TourDetail';
import PaymentCancelPage from '../pages/PaymentCancelPage';
import JournalDetail from '../components/user/JournalDetail';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [

      // =====================================================
      // PUBLIC ROUTES
      // =====================================================

      {
        path: '/',
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },

          {
            path: '/payment/success',
            element: <PaymentSuccessPage />,
          },

          {
            path: '/accept-invitation',
            element: <AcceptInvite />,
          },

          {
            path: '/tours/:id',
            element: <TourDetail />,
          },

          {
            path: '/about',
            element: <About />,
          },
        ],
      },

      // =====================================================
      // AUTHENTICATION ROUTES
      // =====================================================

      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },

          {
            path: 'register',
            element: <Register />,
          },

          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },

          {
            path: 'verify-otp',
            element: <VerifyOtp />,
          },

          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
        ],
      },

      // =====================================================
      // PROTECTED ROUTES
      // =====================================================

      {
        path: '/',
        element: <ProtectedRoute />,
        children: [

          // =================================================
          // 1. TRAVELER PORTAL
          // =================================================

          {
            element: (
              <RoleRoute
                allowedRoles={[ROLES.TRAVELER]}
              />
            ),

            children: [
              {
                element: <TravelerLayout />,

                children: [
                  {
                    path: 'traveler/home',
                    element: <Home />,
                  },

                  {
                    path: 'dashboard/bookings',
                    element: <MyBookings />,
                  },

                  {
                    path: 'bookings/:id',
                    element: <BookingDetails />,
                  },

                  {
                    path: 'payment/cancel',
                    element: <PaymentCancelPage />,
                  },

                  {
                    path: 'journal',
                    element: <Journal />,
                  },

                  {
                    path: 'journals/:id',
                    element: <JournalDetail />,
                  },

                  {
                    path: 'profile',
                    element: <TravelerProfile />,
                  },
                ],
              },
            ],
          },

          // =================================================
          // 2. COMPANY ADMIN PORTAL
          // =================================================

          {
            element: (
              <RoleRoute
                allowedRoles={[ROLES.COMPANY_ADMIN]}
              />
            ),

            children: [
              {
                element: (
                  <DashboardLayout
                    portalType="company"
                  />
                ),

                children: [
                  {
                    path: '/company/dashboard',
                    element: <CompanyDashboard />,
                  },

                  {
                    path: '/company/employees',
                    element: <Employees />,
                  },

                  {
                    path: '/company/subscription',
                    element: <CompanySubscription />,
                  },

                  {
                    path: '/company/tours',
                    element: <CompanyTour />,
                  },

                  {
                    path: '/company/profile',
                    element: <CompanyProfile />,
                  },

                  {
                    path: '/company/bookings',
                    element: <CompanyBookings />,
                  },
                ],
              },
            ],
          },

          // =================================================
          // EMPLOYEE PORTAL
   
          {
            element: (
              <RoleRoute
                allowedRoles={[
                  ROLES.EMPLOYEE,
                  ROLES.COMPANY_ADMIN,
                ]}
              />
            ),

            children: [
              {
                element: (
                  <DashboardLayout
                    portalType="employee"
                  />
                ),

                children: [
                  {
                    path: '/employee/dashboard',
                    element: <EmployeeDashboard />,
                  },
                  {path:"/employee/profile",
                     element:<EmpProfile/>},
                 { path:"/employee/reviews",
                     element:<EmpReviews/>},
                {path:"/employee/bookings" ,
                     element:<EmpBookings/>},
                     {path:"/employee/tours",
                      element:<EmpTours/>
                     }
                ],
              },
            ],
          },

          // =================================================
          // 4. SUPER ADMIN PORTAL
          // =================================================

          {
            element: (
              <RoleRoute
                allowedRoles={[ROLES.SUPER_ADMIN]}
              />
            ),

            children: [
              {
                element: (
                  <DashboardLayout
                    portalType="super-admin"
                  />
                ),

                children: [
                  {
                    path: '/super-admin/dashboard',
                    element: <SuperAdminDashboard />,
                  },

                  {
                    path: '/super-admin/companies',
                    element: <CompanyManagement />,
                  },

                  {
                    path: '/super-admin/users',
                    element: <UserManagement />,
                  },

                  {
                    path: '/super-admin/analytics',
                    element: <Analysis />,
                  },

                  {
                    path: '/super-admin/subscriptions',
                    element: <Subscriptions />,
                  },

                  {
                    path: '/super-admin/tours',
                    element: <Tours />,
                  },
                ],
              },
            ],
          },
        ],
      },

      // =====================================================
      // SYSTEM ROUTES
      // =====================================================

      {
        path: '/unauthorized',
        element: <Unauthorized />,
      },

      // =====================================================
      // 404 FALLBACK
      // =====================================================

      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);