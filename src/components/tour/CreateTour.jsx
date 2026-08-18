import React, { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";

import TourCreationMethod from "./TourCreationMethod";
import TourGenerationInput from "./TourGenerationInput";
import TourForm from "./TourForm";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const getInitialTourFormData = () => ({
  title: "",
  description: "",
  from: "",
  to: "",

  duration: 3,
  price: 15000,
  maxParticipants: 10,

  status: "draft",

  coverImage: {
    url: "",
    public_id: "",
  },

  images: [],

  itinerary: [],

  budgetBreakdown: {
    hotel: 0,
    transport: 0,
    food: 0,
    activities: 0,
  },

  travelTips: [],

  bestTimeToVisit: "",

  importantNotes: [],

  faqs: [],
});

// ============================================================
// FORMAT EDIT TOUR
// ============================================================

const formatTourForForm = (tour) => {
  if (!tour) {
    return getInitialTourFormData();
  }

  return {
    title: tour.title || "",

    description: tour.description || "",

    from: tour.from || "",

    to: tour.to || "",

    duration: tour.duration ?? 3,

    price: tour.price ?? 15000,

    maxParticipants:
      tour.maxParticipants ?? 10,

    status: tour.status || "draft",

    coverImage: {
      url: tour.coverImage?.url || "",

      public_id:
        tour.coverImage?.public_id || "",
    },

    images: tour.images || [],

    itinerary: tour.itinerary || [],

    budgetBreakdown: {
      hotel:
        tour.budgetBreakdown?.hotel ?? 0,

      transport:
        tour.budgetBreakdown?.transport ?? 0,

      food:
        tour.budgetBreakdown?.food ?? 0,

      activities:
        tour.budgetBreakdown?.activities ?? 0,
    },

    travelTips: tour.travelTips || [],

    bestTimeToVisit:
      tour.bestTimeToVisit || "",

    importantNotes:
      tour.importantNotes || [],

    faqs: tour.faqs || [],
  };
};

// ============================================================
// CREATE TOUR
// ============================================================

const CreateTour = ({
  isOpen,
  onClose,
  onSuccess,

  // Edit mode
  editTour = null,
}) => {
  // ==========================================================
  // EDIT MODE
  // ==========================================================

  const isEditMode = Boolean(editTour);

  // ==========================================================
  // STATE
  // ==========================================================

  const [step, setStep] = useState("method");

  const [tourFormData, setTourFormData] =
    useState(getInitialTourFormData());

  // ==========================================================
  // POPULATE FORM
  // ==========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // --------------------------------------------------------
    // EDIT MODE
    // --------------------------------------------------------

    if (editTour) {
      console.log(
        "CreateTour - Edit Tour:",
        editTour
      );

      const formattedTour =
        formatTourForForm(editTour);

      console.log(
        "CreateTour - Formatted Data:",
        formattedTour
      );

      setTourFormData(formattedTour);

      setStep("form");

      return;
    }

    // --------------------------------------------------------
    // CREATE MODE
    // --------------------------------------------------------

    setTourFormData(
      getInitialTourFormData()
    );

    setStep("method");
  }, [isOpen, editTour]);

  // ==========================================================
  // CLOSE
  // ==========================================================

  const handleClose = () => {
    setStep("method");

    setTourFormData(
      getInitialTourFormData()
    );

    onClose?.();
  };

  // ==========================================================
  // MANUAL CREATION
  // ==========================================================

  const handleManualCreation = () => {
    setStep("form");
  };

  // ==========================================================
  // AI GENERATED TOUR
  // ==========================================================

  const handleAIGeneratedTour = (
    generatedTour
  ) => {
    setTourFormData({
      ...getInitialTourFormData(),
      ...(generatedTour || {}),
    });

    setStep("form");
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    // --------------------------------------------------------
    // Editing
    // --------------------------------------------------------

    if (isEditMode) {
      handleClose();
      return;
    }

    // --------------------------------------------------------
    // Creating
    // --------------------------------------------------------

    if (step === "form") {
      setStep("method");
      return;
    }

    if (step === "ai-input") {
      setStep("method");
    }
  };

  // ==========================================================
  // DON'T RENDER
  // ==========================================================

  if (!isOpen) {
    return null;
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl my-8 max-h-[92vh] flex flex-col overflow-hidden">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>

            <div>

              <h2 className="text-lg font-bold font-serif text-slate-900">

                {step === "method" &&
                  "Create a New Tour"}

                {step === "ai-input" &&
                  "Generate Tour with AI"}

                {step === "form" &&
                  (isEditMode
                    ? "Edit Tour"
                    : "Build Your Tour")}

              </h2>

              <p className="text-[11px] text-slate-500 mt-0.5">

                {step === "method" &&
                  "Choose how you would like to create your tour."}

                {step === "ai-input" &&
                  "Provide a few details and let AI build your tour."}

                {step === "form" &&
                  (isEditMode
                    ? "Update the tour details and save your changes."
                    : "Review and customize your tour before saving.")}

              </p>

            </div>

          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="overflow-y-auto flex-1 p-6">

          {/* ==================================================
              CREATE METHOD
          ================================================== */}

          {step === "method" &&
            !isEditMode && (
              <TourCreationMethod
                onGenerateWithAI={() =>
                  setStep("ai-input")
                }
                onCreateYourself={
                  handleManualCreation
                }
              />
            )}

          {/* ==================================================
              AI INPUT
          ================================================== */}

          {step === "ai-input" &&
            !isEditMode && (
              <TourGenerationInput
                onGenerated={
                  handleAIGeneratedTour
                }
                onBack={handleBack}
              />
            )}

          {/* ==================================================
              TOUR FORM
          ================================================== */}

          {step === "form" && (
            <TourForm
              key={
                editTour?._id ||
                editTour?.id ||
                "new-tour"
              }
              tourFormData={tourFormData}
              setTourFormData={
                setTourFormData
              }
              onBack={handleBack}
              onSuccess={onSuccess}
              onClose={handleClose}
              editMode={isEditMode}
              tourId={
                editTour?._id ||
                editTour?.id ||
                null
              }
            />
          )}

        </div>

      </div>
    </div>
  );
};

export default CreateTour;