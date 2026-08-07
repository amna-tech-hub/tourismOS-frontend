import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-cover bg-center bg-no-repeat font-sans"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop')`,
      }}
    >
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-3 sm:p-5 gap-4">
        
        {/* Left Side: Mountain Hero Banner */}
        <div 
          className="lg:col-span-5 rounded-2xl relative p-8 flex flex-col justify-between text-white overflow-hidden bg-cover bg-center min-h-[480px] lg:min-h-[600px]"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop')`,
          }}
        >
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/90 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg">
              ▲
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif leading-none tracking-tight">
                AI Tourism<span className="text-amber-400">OS</span>
              </h2>
              <p className="text-[10px] text-slate-300 tracking-wide mt-0.5">
                The Intelligent Tourism Operating System
              </p>
            </div>
          </div>

          {/* Hero Heading Text */}
          <div className="my-auto py-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold font-serif leading-tight">
              Your Next <br />
              <span className="text-amber-400">Adventure</span> <br />
              Awaits!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-4 leading-relaxed max-w-xs font-sans">
              Create your account and unlock the power of AI to plan, explore and travel smarter.
            </p>
          </div>

          {/* Bottom Feature Badges Grid */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center">
              <span className="text-lg">📍</span>
              <span className="text-[10px] text-slate-200 mt-1 font-medium">Smart Planning</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg">🛡️</span>
              <span className="text-[10px] text-slate-200 mt-1 font-medium">Safety First</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg">🌐</span>
              <span className="text-[10px] text-slate-200 mt-1 font-medium">Offline Support</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg">🤖</span>
              <span className="text-[10px] text-slate-200 mt-1 font-medium">AI Assistant</span>
            </div>
          </div>
        </div>

        {/* Right Side: Render Form Pages */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-10 flex flex-col justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}