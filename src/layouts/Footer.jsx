import { Compass, Send,  Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-slate-900">
                AI Tourism<span className="text-amber-500">OS</span>
              </span>
            </Link>
            <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
              Your all-in-one AI powered platform for smart travel planning, real-time updates, and unforgettable journeys.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* {[ Twitter, Youtube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))} */}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-amber-600 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              {['Features', 'How It Works', 'AI Tools', 'Pricing'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-amber-600 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {['About', 'Blog', 'Contact Us', 'Careers'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-amber-600 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5 text-sm">
              {['Help Center', 'Privacy Policy', 'Terms and Conditions', 'FAQs'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3 lg:col-span-1">
            <h4 className="font-sans font-semibold text-amber-600 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-slate-600">Subscribe to get travel tips, offers, and updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
              />
              <button type="submit" className="absolute right-1 p-1.5 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-600 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI TourismOS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-800">Privacy</Link>
            <Link href="#" className="hover:text-slate-800">Terms</Link>
            <Link href="#" className="hover:text-slate-800">Cookies</Link>
            <button className="flex items-center gap-1 hover:text-slate-800 cursor-pointer">
              <Globe className="w-3.5 h-3.5" /> English ▾
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}