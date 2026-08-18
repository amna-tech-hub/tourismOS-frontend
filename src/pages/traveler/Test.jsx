import { Sparkles, Shield, Mic, CloudSun, ArrowRight, Play, Star } from 'lucide-react';
import CreateTour from '../../components/tour/CreateTour';
import { useState } from 'react';
import TourCard from '../../components/tour/TourCard';

export default function Test() {
  console.log("came in public test");
    const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);

  return (
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Explore Pakistan with <span className="text-amber-500">AI.</span>
              </h1>
              
              <p className="subheading text-lg max-w-lg leading-relaxed">
                Your intelligent travel planner, translator, safety advisor, and local guide. Plan better, travel safer, experience more with the power of AI.
              </p>

              {/* Pill Badge Highlights */}
              <div className="flex flex-wrap gap-2.5 py-2">
                <span className="badge-yellow gap-1.5 py-1.5 px-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Trip Planner
                </span>
                <span className="badge-yellow gap-1.5 py-1.5 px-3">
                  <Shield className="w-3.5 h-3.5 text-amber-600" /> Real-Time Safety
                </span>
              
                <span className="badge-yellow gap-1.5 py-1.5 px-3">
                  <CloudSun className="w-3.5 h-3.5 text-amber-600" /> Weather Forecast
                </span>
              </div>

              {/* Hero Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button className="btn-yellow gap-2">
                  Start Planning <ArrowRight className="w-4 h-4" />
                </button>
                <button className="btn-outline gap-2 border-amber-300 hover:border-amber-400">
                  <Play className="w-4 h-4 fill-amber-500 text-amber-500" /> Watch Demo
                </button>
              </div>

              {/* Social Proof / Rating */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="w-9 h-9 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="font-bold text-slate-900 ml-1 text-sm">4.9/5</span>
                  </div>
                  <p className="text-xs text-slate-500">Trusted by 50k+ travellers</p>
                </div>
              </div>

            </div>

            {/* Right Column Masked Image Hero Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-square lg:aspect-[4/5] rounded-[2.5rem] lg:rounded-l-[200px] overflow-hidden shadow-2xl shadow-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" 
                    alt="Travel Scenic Destination" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        
        </div>
      </section>
  );
}