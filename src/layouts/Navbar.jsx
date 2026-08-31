import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
import tourix from "/public/tourixLogo.webp";
import { FaPerson } from "react-icons/fa6";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAboutPage = location.pathname === "/about";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if navbar should render solid light styles:
  // If it's NOT the homepage or about page, force light/scrolled styling.
  // If it IS the homepage or about page, base it on scroll state.
  const shouldBeTransparent = isHomePage || isAboutPage;
  const isSolidStyle = !shouldBeTransparent || isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolidStyle
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/50 py-4 text-neutral-900"
          : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={tourix}
            alt="Tourix Logo"
            className="w-9 h-9 rounded-xl object-cover"
          />
          <div className="flex flex-col">
            <span
              className={`font-serif text-lg tracking-wider font-semibold uppercase ${
                isSolidStyle ? "text-neutral-900" : "text-white"
              }`}
            >
              AI Tourism<span className="text-yellow-500">OS</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 font-bold">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative text-xs font-medium uppercase tracking-[0.2em] transition-colors pb-2 ${
                isActive
                  ? "text-yellow-600 font-semibold after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-yellow-500"
                  : isSolidStyle
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-white/80 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard/bookings"
            className={({ isActive }) =>
              `relative text-xs font-medium uppercase tracking-[0.2em] transition-colors pb-2 ${
                isActive
                  ? "text-yellow-600 font-semibold after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-yellow-500"
                  : isSolidStyle
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-white/80 hover:text-white"
              }`
            }
          >
            Bookings
          </NavLink>

          <NavLink
            to="/journal"
            className={({ isActive }) =>
              `relative text-xs font-medium uppercase tracking-[0.2em] transition-colors pb-2 ${
                isActive
                  ? "text-yellow-600 font-semibold after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-yellow-500"
                  : isSolidStyle
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-white/80 hover:text-white"
              }`
            }
          >
            Travel Journal
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative text-xs font-medium uppercase tracking-[0.2em] transition-colors pb-2 ${
                isActive
                  ? "text-yellow-600 font-semibold after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-yellow-500"
                  : isSolidStyle
                  ? "text-neutral-600 hover:text-neutral-900"
                  : "text-white/80 hover:text-white"
              }`
            }
          >
            About Us
          </NavLink>
        </nav>

        {/* Action Area */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/profile"
            className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 transition-colors ${
              isSolidStyle
                ? "text-neutral-800 hover:text-yellow-600"
                : "text-white hover:text-yellow-300"
            }`}
          >
            <button
              aria-label="Search destinations"
              className={`p-2 transition-colors cursor-pointer ${
                isSolidStyle
                  ? "text-neutral-700 hover:text-neutral-900"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <User className="w-5 h-5" />
            </button>
          </Link>

          <Link
            to="auth/login"
            className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 transition-colors ${
              isSolidStyle
                ? "text-neutral-800 hover:text-yellow-600"
                : "text-white hover:text-yellow-300"
            }`}
          >
            Login
          </Link>

          <Link
            to="auth/register"
            className="btn-primary !py-2.5 !px-5 text-xs uppercase tracking-wider !rounded-md"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 transition-colors ${
            isSolidStyle ? "text-neutral-900" : "text-white"
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900/95 backdrop-blur-md text-white px-6 py-8 flex flex-col gap-6 border-b border-neutral-800">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-sm uppercase tracking-widest transition-colors ${
                isActive ? "text-yellow-400" : "text-white/80 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>
          
          <NavLink
            to="/dashboard/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-sm uppercase tracking-widest transition-colors ${
                isActive ? "text-yellow-400" : "text-white/80 hover:text-white"
              }`
            }
          >
            Bookings
          </NavLink>
          
          <NavLink
            to="/journal"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-sm uppercase tracking-widest transition-colors ${
                isActive ? "text-yellow-400" : "text-white/80 hover:text-white"
              }`
            }
          >
            Travel Journal
          </NavLink>
          
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-sm uppercase tracking-widest transition-colors ${
                isActive ? "text-yellow-400" : "text-white/80 hover:text-white"
              }`
            }
          >
            About Us
          </NavLink>
          
          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm uppercase tracking-widest text-white/80 hover:text-white py-2"
            >
              Profile
            </Link>
            <Link
              to="auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm uppercase tracking-widest text-white/80 hover:text-white py-2"
            >
              Login
            </Link>
            <Link
              to="auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-center text-xs uppercase tracking-wider py-3"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}