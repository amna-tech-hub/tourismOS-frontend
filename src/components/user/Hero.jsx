import React from "react";
import {
  Compass,
  Award,
  Clock,
  Users,
  Plane,
} from "lucide-react";
import bg from "/public/l3.jpg";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen bg-neutral-900 text-white flex flex-col justify-between overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bg}
          alt="Luxury Resort Destination"
          className="w-full h-full object-cover object-center"
        />

        {/* Image Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 my-auto py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side Copy */}
        <div className="lg:col-span-7 space-y-6">
          {/* Eyebrow */}
          <span className="text-[#fbbf24] text-2xl sm:text-3xl font-serif italic tracking-wide block">
            Your journey starts here
          </span>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] text-white!">
            Discover <br />
            <span className="text-[#fbbf24]">Paradise</span>
          </h1>

          {/* Description */}
          <p className="max-w-md text-sm sm:text-base text-neutral-200 leading-relaxed">
            Find hidden gems, unforgettable experiences, and create memories
            that last a lifetime.
          </p>

          {/* Call To Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#destinations"
              className="inline-flex items-center gap-2 bg-[#fbbf24] border border-amber-500/40 hover:bg-amber-300 text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-full shadow-md transition-colors active:scale-[0.98]"
            >
              Explore Destinations
              <Plane className="w-4 h-4 text-slate-800" />
            </a>
          </div>
        </div>

        {/* Right Side Floating Card */}
        <div className="hidden lg:flex lg:col-span-5 justify-end">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/40 text-neutral-900 w-72 flex items-center gap-4 transform hover:-translate-y-1 transition-transform">
            <img
              src={bg}
              alt="Luxury Resort"
              className="w-24 h-24 rounded-xl object-cover"
            />

            <div className="space-y-1">
              <h4 className="font-bold text-base leading-tight">
                Travel with Confidence
              </h4>

              <p className="text-xs text-neutral-500">
                Weather & safety insights for every journey
              </p>

              <div className="pt-2 flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-500">
                  Check{" "}
                  <strong className="text-neutral-900 text-sm font-bold">
                    Before You Go
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Destinations */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#fbbf24]">
              <Compass className="w-5 h-5" />
            </div>

            <div>
              <p className="text-base font-bold leading-none">200+</p>
              <p className="text-[11px] text-neutral-300 mt-1">
                Destinations
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#fbbf24]">
              <Award className="w-5 h-5" />
            </div>

            <div>
              <p className="text-base font-bold leading-none">
                Best Price
              </p>
              <p className="text-[11px] text-neutral-300 mt-1">
                Guarantee
              </p>
            </div>
          </div>

          {/* Support */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#fbbf24]">
              <Clock className="w-5 h-5" />
            </div>

            <div>
              <p className="text-base font-bold leading-none">
                24/7 Support
              </p>
              <p className="text-[11px] text-neutral-300 mt-1">
                We're here to help
              </p>
            </div>
          </div>

          {/* Travelers */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#fbbf24]">
              <Users className="w-5 h-5" />
            </div>

            <div>
              <p className="text-base font-bold leading-none">
                Trusted by
              </p>
              <p className="text-[11px] text-neutral-300 mt-1">
                1M+ Travelers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;