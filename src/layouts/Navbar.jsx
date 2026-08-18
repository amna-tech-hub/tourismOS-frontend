import { Link } from 'react-router-dom';
import { Search, Compass } from 'lucide-react';
import tourix from '/public/tourixLogo.webp'; // Keep this if you want to use it

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Option 1: Use the imported tourix image as logo */}
            <img 
              src={tourix} 
              alt="Tourix Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />
            
            {/* Option 2: Keep the Compass icon (uncomment this and comment the img above if you prefer) */}
            {/* <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-200">
              <Compass className="w-6 h-6" />
            </div> */}
            
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900">
                AI Tourism<span className="text-amber-500">OS</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-sans -mt-1">
                Smart Travel Engine
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-sans text-sm font-medium text-amber-600 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-amber-500">
              Home
            </Link>
            <Link to="#features" className="font-sans text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link to="#destinations" className="font-sans text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Destinations
            </Link>
            <Link to="#pricing" className="font-sans text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link to="#about" className="font-sans text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              About Us
            </Link>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            <button aria-label="Search destinations" className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
            
            <Link to="auth/login" className="btn-outline !py-2.5 !px-5 text-sm">
              Login
            </Link>
            
            <Link to="auth/register" className="btn-yellow !py-2.5 !px-5 text-sm">
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}