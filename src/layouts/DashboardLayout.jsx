import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaChartPie, 
  FaBuilding, 
  FaUsers, 
  FaChartLine, 
  FaCreditCard, 
  FaCog, 
  FaMountain, 
  FaUserTie, 
  FaTicketAlt, 
  FaRobot, 
  FaSignOutAlt,
  FaBars,
  FaCircle
} from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

export default function DashboardLayout({ portalType = 'super-admin' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Navigation Links definition with react-icons based on portal role
  const getNavItems = () => {
    if (portalType === 'super-admin') {
      return [
        { label: 'Overview', path: '/super-admin/dashboard', icon: <FaChartPie className="text-base" /> },
        { label: 'Companies', path: '/super-admin/companies', icon: <FaBuilding className="text-base" /> },
        { label: 'Users', path: '/super-admin/users', icon: <FaUsers className="text-base" /> },
        { label: 'Analytics', path: '/super-admin/analytics', icon: <FaChartLine className="text-base" /> },
        { label: 'Subscriptions', path: '/super-admin/subscriptions', icon: <FaCreditCard className="text-base" /> },
        { label: 'Settings', path: '/super-admin/settings', icon: <FaCog className="text-base" /> },
      ];
    }
    if (portalType === 'company') {
      return [
        { label: 'Dashboard', path: '/company/dashboard', icon: <FaChartPie className="text-base" /> },
        { label: 'Tours', path: '/company/tours', icon: <FaMountain className="text-base" /> },
        { label: 'Employees', path: '/company/employees', icon: <FaUserTie className="text-base" /> },
        { label: 'Bookings', path: '/company/bookings', icon: <FaTicketAlt className="text-base" /> },
        { label: 'AI Copilot', path: '/company/ai', icon: <FaRobot className="text-base" /> },
        { label: 'Company Profile', path: '/company/profile', icon: <FaBuilding className="text-base" /> },
      ];
    }
    return [
      { label: 'Dashboard', path: '/employee/dashboard', icon: <FaChartPie className="text-base" /> },
      { label: 'Tours', path: '/employee/tours', icon: <FaMountain className="text-base" /> },
      { label: 'Bookings', path: '/employee/bookings', icon: <FaTicketAlt className="text-base" /> },
    ];
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          {/* Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold font-sans">
                ▲
              </div>
              <span className="font-serif font-bold text-lg text-white tracking-wide">
                Tourism<span className="text-amber-400">OS</span>
              </span>
            </div>
            <span className="badge-yellow text-[10px] py-0.5 px-2 bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase font-semibold">
              {portalType.replace('-', ' ')}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 font-sans">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3 font-sans">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <span className="flex items-center text-[10px] text-emerald-400 gap-1 font-medium shrink-0" title="System Online">
              <FaCircle className="text-[6px] text-emerald-400 animate-pulse" />
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <FaSignOutAlt className="text-xs" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden p-4 pb-0 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-xs cursor-pointer"
          >
            <FaBars className="text-base" />
          </button>
        </div>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 font-sans">
          <Outlet />
        </main>
      </div>
    </div>
  );
}