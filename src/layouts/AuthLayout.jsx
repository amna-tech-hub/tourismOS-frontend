import React from 'react';
import { Outlet } from 'react-router-dom';
import { Compass, Shield, Languages, Bot } from 'lucide-react';
import bg from "/public/l3.jpg";
import tourix from "/public/tourixLogo.webp";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#fbbf2400]" >
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 bg-transparent">
        
        {/* Left Side - Hero Card (Hidden on mobile via 'hidden lg:flex', enhanced borders & shadows) */}
        <div className="hidden lg:flex lg:col-span-6 relative rounded-3xl overflow-hidden min-h-[600px] flex-col justify-between p-8 text-white border border-white/20 shadow-2xl shadow-amber-500/10 ring-1 ring-white/10">
          {/* Background Image */}
          <img
            src={bg}
            alt="Hikers on mountain"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Top - Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src={tourix}
              alt="Tourix Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg"
            />
            <div>
              <h2 className="text-lg font-bold font-serif leading-none tracking-tight text-white!">
                AI Tourism<span className="text-yellow-300">OS</span>
              </h2>
              <p className="text-[9px] text-white/70! tracking-wide mt-0.5 font-medium">
                Intelligent Tourism Platform
              </p>
            </div>
          </div>

          {/* Hero Content - Glass Bar Wrapper */}
          <div className="relative z-10 p-6 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-white!">
              Your <br /> Next Adventure <br /> Awaits!
            </h1>
            <p className="text-xs text-white/90 leading-relaxed max-w-xs font-light">
              Log in to unlock exclusive deals, plan your dream escapes and pick up where you left off. Whether it's mountains, beaches or city lights. Your journey starts here.
            </p>
          </div>

          {/* Bottom Features Glass Bar */}
          <div className="relative z-10 bg-white/30 backdrop-blur-md rounded-2xl p-3 grid grid-cols-4 gap-1 text-slate-800 border border-white/30 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <Compass size={16} className="text-white" />
              <span className="text-[9px] font-semibold mt-1">Smart Planning</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield size={16} className="text-white" />
              <span className="text-[9px] font-semibold mt-1">Safety First</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Languages size={16} className="text-white" />
              <span className="text-[9px] font-semibold mt-1">Instant Translation</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Bot size={16} className="text-white" />
              <span className="text-[9px] font-semibold mt-1">AI Assistant</span>
            </div>
          </div>
        </div>

        {/* Right Side - Yellow Card Form Wrapper */}
        <div className="lg:col-span-6 border-0  bg-white rounded-3xl p-8 sm:p-12 flex flex-col justify-center items-center relative text-slate-900 shadow-xl shadow-amber-500/10">
          <Outlet />
        </div>

      </div>
    </div>
  );
}