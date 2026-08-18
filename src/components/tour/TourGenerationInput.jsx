import React, { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";

import { useGenerateTourPreview } from "../../api/queries/useTraveler";

const TourGenerationInput = ({
  onGenerated,
  onBack,
}) => {
  const [previewInput, setPreviewInput] = useState({
    title: "",
    from: "",
    to: "",
    duration: 3,
    price: 15000,
    maxParticipants: 10,
    interests: "",
  });

  const generatePreviewMutation =
    useGenerateTourPreview();

  const updateField = (field, value) => {
    setPreviewInput((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...previewInput,

        duration: Number(previewInput.duration),

        price: Number(previewInput.price),

        maxParticipants: Number(
          previewInput.maxParticipants
        ),

        interests: previewInput.interests
          ? previewInput.interests
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      };

      const response =
        await generatePreviewMutation.mutateAsync(
          payload
        );

      const generated =
        response?.data || response;

      const tourData = {
        title:
          generated?.title ||
          previewInput.title,

        description:
          generated?.description || "",

        from:
          generated?.from ||
          previewInput.from,

        to:
          generated?.to ||
          previewInput.to,

        duration:
          generated?.duration ||
          previewInput.duration,

        price:
          generated?.price ||
          previewInput.price,

        maxParticipants:
          generated?.maxParticipants ||
          previewInput.maxParticipants,

        status:
          generated?.status ||
          "draft",

        coverImage: {
          url: "",
          public_id: "",
        },

        images: [],

        itinerary:
          generated?.itinerary || [],

        budgetBreakdown:
          generated?.budgetBreakdown || {
            hotel: 0,
            transport: 0,
            food: 0,
            activities: 0,
          },

        travelTips:
          generated?.travelTips || [],

        bestTimeToVisit:
          generated?.bestTimeToVisit || "",

        importantNotes:
          generated?.importantNotes || [],

        faqs:
          generated?.faqs || [],
      };

      onGenerated(tourData);

    } catch (error) {
      console.error(
        "Failed to generate tour:",
        error
      );

      // We'll replace this with our proper
      // reusable error UI shortly.
      console.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to generate tour."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* INTRO */}
      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">

        <div className="flex items-start gap-3">

          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>

          <div>

            <h3 className="text-sm font-bold text-slate-900">
              Tell AI about your tour
            </h3>

            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Provide the basic trip information. AI will use
              these details to build the rest of the tour.
            </p>

          </div>

        </div>

      </div>

      {/* BASIC INFORMATION */}
      <div className="space-y-5">

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Tour Title
          </label>

          <input
            type="text"
            required
            placeholder="e.g. Hunza Valley Expedition"
            value={previewInput.title}
            onChange={(event) =>
              updateField(
                "title",
                event.target.value
              )
            }
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
          />

          <p className="text-[10px] text-slate-400 mt-1.5">
            Give your tour a clear and attractive name.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Departure
            </label>

            <input
              type="text"
              required
              placeholder="e.g. Islamabad"
              value={previewInput.from}
              onChange={(event) =>
                updateField(
                  "from",
                  event.target.value
                )
              }
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Destination
            </label>

            <input
              type="text"
              required
              placeholder="e.g. Hunza Valley"
              value={previewInput.to}
              onChange={(event) =>
                updateField(
                  "to",
                  event.target.value
                )
              }
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Duration
            </label>

            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={previewInput.duration}
                onChange={(event) =>
                  updateField(
                    "duration",
                    event.target.value
                  )
                }
                className="w-full px-4 py-3 pr-14 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                days
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Price
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                PKR
              </span>

              <input
                type="number"
                min="0"
                required
                value={previewInput.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value
                  )
                }
                className="w-full px-4 py-3 pl-12 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Max Participants
            </label>

            <input
              type="number"
              min="1"
              required
              value={
                previewInput.maxParticipants
              }
              onChange={(event) =>
                updateField(
                  "maxParticipants",
                  event.target.value
                )
              }
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>

        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Interests
          </label>

          <input
            type="text"
            placeholder="Hiking, Culture, Photography"
            value={previewInput.interests}
            onChange={(event) =>
              updateField(
                "interests",
                event.target.value
              )
            }
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
          />

          <p className="text-[10px] text-slate-400 mt-1.5">
            Separate multiple interests with commas.
          </p>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-100">

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <button
          type="submit"
          disabled={
            generatePreviewMutation.isPending
          }
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs py-3 px-5 rounded-xl font-bold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generatePreviewMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Tour...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Tour
            </>
          )}
        </button>

      </div>

    </form>
  );
};

export default TourGenerationInput;