import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaChartPie, 
  FaBuilding, 
  FaUsers, 
  FaChartLine, 
  FaCreditCard, 
  FaMountain, 
  FaUserTie, 
  FaTicketAlt, 
  FaRobot, 
  FaSignOutAlt,
  FaBars,
  FaCircle,
  FaCog
} from 'react-icons/fa';
import { TypeOutline } from 'lucide-react';
// Import the logo
import tourixLogo from '/public/tourixLogo.webp'; // Adjust path as needed

export default function DashboardLayout({ portalType = 'super-admin' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const getNavItems = () => {
    if (portalType === 'super-admin') {
      return [
        { label: 'Overview', path: '/super-admin/dashboard', icon: <FaChartPie className="text-base" /> },
        { label: 'Companies', path: '/super-admin/companies', icon: <FaBuilding className="text-base" /> },
        { label: 'Users', path: '/super-admin/users', icon: <FaUsers className="text-base" /> },
        { label: 'Subscriptions', path: '/super-admin/subscriptions', icon: <FaCreditCard className="text-base" /> },
        { label: 'Tours', path: '/super-admin/tours', icon: <TypeOutline className="text-base" /> },
        { label: 'Analytics', path: '/super-admin/analytics', icon: <FaChartLine className="text-base" /> },
//hoooks endpoint
      ];
    }
    if (portalType === 'company') {
      return [
        { label: 'Dashboard', path: '/company/dashboard', icon: <FaChartPie className="text-base" /> },
        { label: 'Tours', path: '/company/tours', icon: <FaMountain className="text-base" /> },
        { label: 'Employees', path: '/company/employees', icon: <FaUserTie className="text-base" /> },
        { label: 'Bookings', path: '/company/bookings', icon: <FaTicketAlt className="text-base" /> },
        { label: 'Subcription', path: '/company/subscription', icon: <FaRobot className="text-base" /> },
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

  // Get user initials
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  return (
    <div className="min-h-screen flex bg-bg-secondary font-sans ">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* ===== SIDEBAR - FIXED ===== */}
      <aside className={`fixed top-0 left-0 z-50 w-[280px] max-w-[85vw] h-screen bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header with Logo */}
        <div className="h-[72px] shrink-0 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {/* Logo Image - Replaces the triangle icon */}
            <img 
              src={tourixLogo} 
              alt="TourismOS Logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-amber-500/10 shrink-0"
            />
            <div className="min-w-0">
              <span className="font-serif font-bold text-lg text-white tracking-wide leading-none block truncate">
                Tourism<span className="text-amber-primary">OS</span>
              </span>
              <span className="block text-[9px] font-medium text-slate-400 tracking-wider uppercase truncate">
                {portalType.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-amber-primary text-slate-950 shadow-lg shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
              {({ isActive }) => isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-slate-950/30" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="shrink-0 p-4 border-t border-slate-800/80 space-y-3 bg-slate-900/50">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-9 h-9 rounded-full bg-amber-primary/20 border border-amber-primary/30 flex items-center justify-center font-bold text-sm text-amber-primary shrink-0">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@tourismos.com'}</p>
            </div>
            <span className="flex items-center gap-1 shrink-0" title="System Online">
              <FaCircle className="text-[6px] text-emerald-400 animate-pulse" />
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <FaSignOutAlt className="text-xs shrink-0" />
              <span className="truncate">Logout</span>
            </button>
            <button
              className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors shrink-0"
              title="Settings"
            >
              <FaCog className="text-sm" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 w-full ml-0 lg:ml-[280px] flex flex-col min-h-screen min-w-0">
        
        {/* Top Bar - Mobile Toggle + Status */}
        <header className="sticky top-0 z-30 bg-bg-secondary/80 backdrop-blur-md border-b border-border-subtle px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between lg:justify-end gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary bg-bg-card border border-border-subtle rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            <FaBars className="text-base" />
          </button>
          
          <div className="flex items-center gap-2 sm:gap-4 ml-auto flex-wrap justify-end">
            <span className="hidden sm:inline-flex items-center gap-2 text-xs text-text-muted shrink-0">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              System Online
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-text-secondary bg-bg-card px-2.5 sm:px-3 py-1.5 rounded-lg border border-border-subtle shadow-sm shrink-0">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-bg-secondary w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}