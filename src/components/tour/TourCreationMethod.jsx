import React from "react";
import {
  Sparkles,
  Pencil,
  ArrowRight,
  WandSparkles,
} from "lucide-react";

const TourCreationMethod = ({
  onGenerateWithAI,
  onCreateYourself,
}) => {
  return (
    <div className="space-y-6">

      {/* INTRO */}
      <div className="text-center max-w-xl mx-auto">

        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
          <WandSparkles className="w-7 h-7 text-amber-600" />
        </div>

        <h3 className="text-xl font-bold font-serif text-slate-900">
          How would you like to create your tour?
        </h3>

        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Let AI build a complete itinerary for you, or create
          everything yourself with full control over the tour details.
        </p>

      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* AI OPTION */}
        <button
          type="button"
          onClick={onGenerateWithAI}
          className="group text-left p-6 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200"
        >

          <div className="flex items-start justify-between">

            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>

            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />

          </div>

          <h4 className="text-base font-bold text-slate-900 mt-5">
            Generate with AI
          </h4>

          <p className="text-xs text-slate-500 leading-relaxed mt-2">
            Give us the basic trip details and AI will create
            an itinerary, budget, travel tips and FAQs for you.
          </p>

          <span className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-amber-700">
            Start with AI
            <ArrowRight className="w-3.5 h-3.5" />
          </span>

        </button>

        {/* MANUAL OPTION */}
        <button
          type="button"
          onClick={onCreateYourself}
          className="group text-left p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
        >

          <div className="flex items-start justify-between">

            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-slate-600" />
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />

          </div>

          <h4 className="text-base font-bold text-slate-900 mt-5">
            Create Yourself
          </h4>

          <p className="text-xs text-slate-500 leading-relaxed mt-2">
            Build the tour manually and have complete control
            over your itinerary, budget, tips and FAQs.
          </p>

          <span className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-slate-700">
            Build Manually
            <ArrowRight className="w-3.5 h-3.5" />
          </span>

        </button>

      </div>

      {/* AI CREDIT NOTE */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">

        <p className="text-[11px] text-slate-500 text-center">
          Don't have enough AI credits? No problem — you can
          always create your tour yourself.
        </p>

      </div>

    </div>
  );
};

export default TourCreationMethod;