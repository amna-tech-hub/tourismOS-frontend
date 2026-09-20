import { Link } from 'react-router-dom';
import tourix from "/public/tourixLogo.webp";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={tourix}
            alt="Tourix Logo"
            className="w-8 h-8 rounded-xl object-cover"
          />
          <span className="font-serif text-lg font-bold text-slate-900">
            AI Tourism<span className="text-amber-500">OS</span>
          </span>
        </Link>

        {/* Legal & Copyright */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <p>© {new Date().getFullYear()} AI TourismOS. All rights reserved.</p>
          <Link to="/privacy" className="hover:text-slate-800 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-slate-800 transition-colors">Terms</Link>
          <Link to="/cookies" className="hover:text-slate-800 transition-colors">Cookies</Link>
        </div>

      </div>
    </footer>
  );
}