import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-amber-200 selection:text-amber-900">
      <Navbar />
      <main className="flex-1">
        
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
}