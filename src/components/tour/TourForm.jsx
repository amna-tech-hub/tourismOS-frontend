import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import {
  useCreateTour,
  useUpdateTour,
} from "../../api/queries/useTraveler";

import {
  useGenerateCoverImage,
  useUploadSingleImage,
  useUploadMultipleImages, // ← Added this
  useDeleteImage,
} from "../../api/queries/useUpload";

import AIImagePromptModal from "./AIImagePromptModal";

const TourForm = ({
  tourFormData,
  setTourFormData,
  onBack,
  onSuccess,
  onClose,

  // EDIT MODE
  editMode = false,
  tourId = null,
}) => {
  // =========================================================
  // STATE
  // =========================================================

  const [isImagePromptOpen, setIsImagePromptOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(null);

  // Keep track of Cloudinary images removed/replaced
  const [removedImageIds, setRemovedImageIds] = useState([]);

  // =========================================================
  // MUTATIONS
  // =========================================================

  const createTourMutation = useCreateTour();
  const updateTourMutation = useUpdateTour();
  const uploadSingleImageMutation = useUploadSingleImage();
  const uploadMultipleImagesMutation = useUploadMultipleImages(); // ← Added
  const generateCoverImageMutation = useGenerateCoverImage();
  const deleteImageMutation = useDeleteImage();

  // =========================================================
  // BASIC FIELD HELPERS
  // =========================================================

  const updateField = (field, value) => {
    setTourFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateBudget = (category, value) => {
    setTourFormData((previous) => ({
      ...previous,
      budgetBreakdown: {
        ...previous.budgetBreakdown,
        [category]: Number(value),
      },
    }));
  };

  // =========================================================
  // IMAGE RESPONSE HELPER
  // =========================================================

  const getImageData = (response) => {
    const data =
      response?.data?.coverImage ||
      response?.data?.image ||
      response?.data ||
      response;

    return {
      url: data?.url || data?.imageUrl || data?.secure_url || "",
      public_id: data?.public_id || data?.publicId || "",
    };
  };

  const getMultipleImageData = (response) => {
    const images = response?.data?.images || response?.data || response || [];
    
    // Handle both array and object responses
    if (Array.isArray(images)) {
      return images.map(img => ({
        url: img?.url || img?.imageUrl || img?.secure_url || "",
        public_id: img?.public_id || img?.publicId || "",
      }));
    }
    
    // If it's a single image response wrapped
    if (images?.url) {
      return [{
        url: images.url,
        public_id: images.public_id || "",
      }];
    }
    
    return [];
  };

  // =========================================================
  // COVER IMAGE FUNCTIONS
  // =========================================================

  const handleRemoveCoverImage = () => {
    const publicId = tourFormData.coverImage?.public_id;

    if (publicId) {
      setRemovedImageIds((previous) => {
        if (previous.includes(publicId)) return previous;
        return [...previous, publicId];
      });
    }

    setTourFormData((previous) => ({
      ...previous,
      coverImage: {
        url: "",
        public_id: "",
      },
    }));
  };

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormError("");

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB.");
      }

      const oldPublicId = tourFormData.coverImage?.public_id;
      const response = await uploadSingleImageMutation.mutateAsync(file);
      const imageData = getImageData(response);

      if (!imageData.url) {
        throw new Error("Server did not return an image URL.");
      }

      if (oldPublicId && oldPublicId !== imageData.public_id) {
        setRemovedImageIds((previous) => {
          if (previous.includes(oldPublicId)) return previous;
          return [...previous, oldPublicId];
        });
      }

      setTourFormData((previous) => ({
        ...previous,
        coverImage: {
          url: imageData.url,
          public_id: imageData.public_id,
        },
      }));
    } catch (error) {
      console.error("Failed to upload cover image:", error);
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload image."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleGenerateCoverImage = async (prompt) => {
    setFormError("");

    try {
      const oldPublicId = tourFormData.coverImage?.public_id;
      const response = await generateCoverImageMutation.mutateAsync({ prompt });
      const imageData = getImageData(response);

      if (!imageData.url) {
        throw new Error("AI service did not return an image URL.");
      }

      if (oldPublicId && oldPublicId !== imageData.public_id) {
        setRemovedImageIds((previous) => {
          if (previous.includes(oldPublicId)) return previous;
          return [...previous, oldPublicId];
        });
      }

      setTourFormData((previous) => ({
        ...previous,
        coverImage: {
          url: imageData.url,
          public_id: imageData.public_id,
        },
      }));

      setIsImagePromptOpen(false);
    } catch (error) {
      console.error("Failed to generate cover image:", error);
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to generate image."
      );
    }
  };

  // =========================================================
  // GALLERY IMAGES FUNCTIONS
  // =========================================================

  const handleGalleryImagesUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setFormError("");

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        setFormError(`"${file.name}" is not a valid image file.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError(`"${file.name}" exceeds 5MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const response = await uploadMultipleImagesMutation.mutateAsync(validFiles);
      const newImages = getMultipleImageData(response);

      if (newImages.length === 0) {
        throw new Error("Server did not return any image URLs.");
      }

      setTourFormData((previous) => ({
        ...previous,
        images: [...(previous.images || []), ...newImages],
      }));
    } catch (error) {
      console.error("Failed to upload gallery images:", error);
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload images."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveGalleryImage = (index) => {
    const imageToRemove = tourFormData.images?.[index];
    const publicId = imageToRemove?.public_id;

    if (publicId) {
      setRemovedImageIds((previous) => {
        if (previous.includes(publicId)) return previous;
        return [...previous, publicId];
      });
    }

    setTourFormData((previous) => ({
      ...previous,
      images: (previous.images || []).filter((_, i) => i !== index),
    }));
  };

  // =========================================================
  // ACTIVITY IMAGE FUNCTIONS
  // =========================================================

  const handleActivityImageUpload = async (dayIndex, activityIndex, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormError("");

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB.");
      }

      // Get the old image public_id if it exists
      const currentActivity = tourFormData.itinerary?.[dayIndex]?.activities?.[activityIndex];
      const oldPublicId = currentActivity?.image?.public_id;

      const response = await uploadSingleImageMutation.mutateAsync(file);
      const imageData = getImageData(response);

      if (!imageData.url) {
        throw new Error("Server did not return an image URL.");
      }

      // Mark old image for deletion if it exists and is different
      if (oldPublicId && oldPublicId !== imageData.public_id) {
        setRemovedImageIds((previous) => {
          if (previous.includes(oldPublicId)) return previous;
          return [...previous, oldPublicId];
        });
      }

      setTourFormData((previous) => {
        const updated = [...(previous.itinerary || [])];
        const activities = [...(updated[dayIndex]?.activities || [])];
        
        activities[activityIndex] = {
          ...activities[activityIndex],
          image: {
            url: imageData.url,
            public_id: imageData.public_id,
          },
        };
        
        updated[dayIndex] = {
          ...updated[dayIndex],
          activities,
        };
        
        return {
          ...previous,
          itinerary: updated,
        };
      });
    } catch (error) {
      console.error("Failed to upload activity image:", error);
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload activity image."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveActivityImage = (dayIndex, activityIndex) => {
    const currentActivity = tourFormData.itinerary?.[dayIndex]?.activities?.[activityIndex];
    const publicId = currentActivity?.image?.public_id;

    if (publicId) {
      setRemovedImageIds((previous) => {
        if (previous.includes(publicId)) return previous;
        return [...previous, publicId];
      });
    }

    setTourFormData((previous) => {
      const updated = [...(previous.itinerary || [])];
      const activities = [...(updated[dayIndex]?.activities || [])];
      
      activities[activityIndex] = {
        ...activities[activityIndex],
        image: {
          url: null,
          public_id: null,
        },
      };
      
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities,
      };
      
      return {
        ...previous,
        itinerary: updated,
      };
    });
  };

  // =========================================================
  // ITINERARY - DAYS
  // =========================================================

  const addDay = () => {
    setTourFormData((previous) => ({
      ...previous,
      itinerary: [
        ...(previous.itinerary || []),
        {
          day: (previous.itinerary?.length || 0) + 1,
          title: "",
          location: "",
          description: "",
          activities: [],
        },
      ],
    }));
  };

  const removeDay = (dayIndex) => {
    setTourFormData((previous) => ({
      ...previous,
      itinerary: (previous.itinerary || [])
        .filter((_, index) => index !== dayIndex)
        .map((day, index) => ({
          ...day,
          day: index + 1,
        })),
    }));
  };

  const updateDay = (dayIndex, field, value) => {
    setTourFormData((previous) => {
      const updated = [...(previous.itinerary || [])];
      updated[dayIndex] = {
        ...updated[dayIndex],
        [field]: value,
      };
      return {
        ...previous,
        itinerary: updated,
      };
    });
  };

  // =========================================================
  // ITINERARY - ACTIVITIES
  // =========================================================

  const addActivity = (dayIndex) => {
    setTourFormData((previous) => {
      const updated = [...(previous.itinerary || [])];
      
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities: [
          ...(updated[dayIndex].activities || []),
          {
            title: "",
            image: {
              url: null,
              public_id: null,
            },
          },
        ],
      };
      
      return {
        ...previous,
        itinerary: updated,
      };
    });
  };

  const updateActivity = (dayIndex, activityIndex, value) => {
    setTourFormData((previous) => {
      const updated = [...(previous.itinerary || [])];
      const activities = [...(updated[dayIndex].activities || [])];
      
      activities[activityIndex] = {
        ...activities[activityIndex],
        title: value,
      };
      
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities,
      };
      
      return {
        ...previous,
        itinerary: updated,
      };
    });
  };

  const removeActivity = (dayIndex, activityIndex) => {
    setTourFormData((previous) => {
      const updated = [...(previous.itinerary || [])];
      const activityToRemove = updated[dayIndex].activities?.[activityIndex];
      
      // Mark activity image for deletion
      if (activityToRemove?.image?.public_id) {
        setRemovedImageIds((prev) => {
          if (prev.includes(activityToRemove.image.public_id)) return prev;
          return [...prev, activityToRemove.image.public_id];
        });
      }
      
      updated[dayIndex] = {
        ...updated[dayIndex],
        activities: updated[dayIndex].activities.filter(
          (_, index) => index !== activityIndex
        ),
      };
      
      return {
        ...previous,
        itinerary: updated,
      };
    });
  };

  // =========================================================
  // TRAVEL TIPS
  // =========================================================

  const addTravelTip = () => {
    setTourFormData((previous) => ({
      ...previous,
      travelTips: [...(previous.travelTips || []), ""],
    }));
  };

  const updateTravelTip = (index, value) => {
    setTourFormData((previous) => {
      const updated = [...(previous.travelTips || [])];
      updated[index] = value;
      return {
        ...previous,
        travelTips: updated,
      };
    });
  };

  const removeTravelTip = (index) => {
    setTourFormData((previous) => ({
      ...previous,
      travelTips: (previous.travelTips || []).filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // =========================================================
  // IMPORTANT NOTES
  // =========================================================

  const addImportantNote = () => {
    setTourFormData((previous) => ({
      ...previous,
      importantNotes: [...(previous.importantNotes || []), ""],
    }));
  };

  const updateImportantNote = (index, value) => {
    setTourFormData((previous) => {
      const updated = [...(previous.importantNotes || [])];
      updated[index] = value;
      return {
        ...previous,
        importantNotes: updated,
      };
    });
  };

  const removeImportantNote = (index) => {
    setTourFormData((previous) => ({
      ...previous,
      importantNotes: (previous.importantNotes || []).filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // =========================================================
  // FAQ
  // =========================================================

  const addFaq = () => {
    setTourFormData((previous) => ({
      ...previous,
      faqs: [
        ...(previous.faqs || []),
        {
          question: "",
          answer: "",
        },
      ],
    }));
  };

  const updateFaq = (index, field, value) => {
    setTourFormData((previous) => {
      const updated = [...(previous.faqs || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return {
        ...previous,
        faqs: updated,
      };
    });
  };

  const removeFaq = (index) => {
    setTourFormData((previous) => ({
      ...previous,
      faqs: (previous.faqs || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  // =========================================================
  // DELETE REMOVED CLOUDINARY IMAGES
  // =========================================================

  const deleteRemovedImages = async () => {
    if (removedImageIds.length === 0) return;

    const uniqueImageIds = [...new Set(removedImageIds)];
    const results = await Promise.allSettled(
      uniqueImageIds.map((publicId) =>
        deleteImageMutation.mutateAsync(publicId)
      )
    );

    const failedDeletes = results.filter((result) => result.status === "rejected");
    if (failedDeletes.length > 0) {
      console.error(
        "Some Cloudinary images could not be deleted:",
        failedDeletes
      );
      console.warn(
        `${failedDeletes.length} image(s) could not be removed from Cloudinary.`
      );
    }

    setRemovedImageIds([]);
  };

  // =========================================================
  // FINAL SUBMIT
  // =========================================================

  const handleFinalSubmit = async (status) => {
    setFormError("");
    setSubmittingStatus(status);

    if (editMode && !tourId) {
      setFormError("Tour ID is missing. Unable to update this tour.");
      setSubmittingStatus(null);
      return;
    }

    // VALIDATION
    if (!tourFormData.title?.trim()) {
      setFormError("Please enter a tour title.");
      setSubmittingStatus(null);
      return;
    }

    if (!tourFormData.from?.trim()) {
      setFormError("Please enter the departure location.");
      setSubmittingStatus(null);
      return;
    }

    if (!tourFormData.to?.trim()) {
      setFormError("Please enter the destination.");
      setSubmittingStatus(null);
      return;
    }

    try {
      const payload = {
        ...tourFormData,
        status,
        title: tourFormData.title.trim(),
        description: tourFormData.description?.trim() || "",
        from: tourFormData.from.trim(),
        to: tourFormData.to.trim(),
        duration: Number(tourFormData.duration),
        price: Number(tourFormData.price),
        maxParticipants: Number(tourFormData.maxParticipants),
        coverImage: tourFormData.coverImage?.url
          ? {
              url: tourFormData.coverImage.url,
              public_id: tourFormData.coverImage.public_id || "",
            }
          : {
              url: "",
              public_id: "",
            },
        images: (tourFormData.images || []).filter(img => img.url && img.public_id),
      };

      if (editMode) {
        await updateTourMutation.mutateAsync({
          id: tourId,
          ...payload,
        });
        await deleteRemovedImages();
      } else {
        await createTourMutation.mutateAsync(payload);
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error(
        editMode ? "Failed to update tour:" : "Failed to create tour:",
        error
      );
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          (editMode ? "Failed to update tour." : "Failed to create tour.")
      );
    } finally {
      setSubmittingStatus(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  const isSubmitting =
    createTourMutation.isPending ||
    updateTourMutation.isPending ||
    uploadSingleImageMutation.isPending ||
    uploadMultipleImagesMutation.isPending ||
    generateCoverImageMutation.isPending ||
    deleteImageMutation.isPending;

  // =========================================================
  // DEFAULT AI IMAGE PROMPT
  // =========================================================

  const defaultImagePrompt =
    `Scenic landscape banner of ${tourFormData.to || "the destination"}, traveling from ${
      tourFormData.from || "the departure location"
    }, vibrant color photography, high details`;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-7">
      {/* FORM ERROR */}
      {formError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex-1">
            <p className="text-xs font-bold text-red-700">Unable to continue</p>
            <p className="text-[11px] text-red-600 mt-0.5">{formError}</p>
          </div>
          <button
            type="button"
            onClick={() => setFormError("")}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BASIC INFORMATION */}
      <section className="space-y-5">
        <SectionHeader
          title="Basic Information"
          description="Add the main details travelers should know about this tour."
        />

        <div className="space-y-4">
          <Field label="Tour Title" required>
            <input
              type="text"
              value={tourFormData.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Hunza Valley Expedition"
              className={inputClass}
            />
          </Field>

          <Field label="Description" required>
            <textarea
              rows={4}
              value={tourFormData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe what travelers can expect from this tour..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Departure" required>
              <input
                type="text"
                value={tourFormData.from || ""}
                onChange={(e) => updateField("from", e.target.value)}
                placeholder="e.g. Islamabad"
                className={inputClass}
              />
            </Field>

            <Field label="Destination" required>
              <input
                type="text"
                value={tourFormData.to || ""}
                onChange={(e) => updateField("to", e.target.value)}
                placeholder="e.g. Hunza Valley"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Duration">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={tourFormData.duration ?? ""}
                  onChange={(e) => updateField("duration", e.target.value)}
                  className={`${inputClass} pr-14`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                  days
                </span>
              </div>
            </Field>

            <Field label="Price">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                  PKR
                </span>
                <input
                  type="number"
                  min="0"
                  value={tourFormData.price ?? ""}
                  onChange={(e) => updateField("price", e.target.value)}
                  className={`${inputClass} pl-12`}
                />
              </div>
            </Field>

            <Field label="Max Participants">
              <input
                type="number"
                min="1"
                value={tourFormData.maxParticipants ?? ""}
                onChange={(e) => updateField("maxParticipants", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Best Time to Visit">
            <input
              type="text"
              value={tourFormData.bestTimeToVisit || ""}
              onChange={(e) => updateField("bestTimeToVisit", e.target.value)}
              placeholder="e.g. April to October"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* COVER IMAGE */}
      <section className="space-y-5">
        <SectionHeader
          title="Cover Image"
          description="Choose an image that represents the experience travelers will have."
        />

        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <div className="aspect-[16/7] bg-slate-100 relative">
            {tourFormData.coverImage?.url ? (
              <>
                <img
                  src={tourFormData.coverImage.url}
                  alt="Tour cover"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveCoverImage}
                  disabled={isSubmitting}
                  title="Remove cover image"
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/95 backdrop-blur shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="w-8 h-8 mb-2" />
                <p className="text-xs font-medium">No cover image selected</p>
                <p className="text-[10px] mt-1">Upload an image or generate one with AI</p>
              </div>
            )}
          </div>

          <div className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-700">Tour Cover</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                JPG, PNG or WebP · Max 5MB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition ${
                  uploadSingleImageMutation.isPending
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                {uploadSingleImageMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5" />
                )}
                {uploadSingleImageMutation.isPending ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleCoverImageUpload}
                />
              </label>

              <button
                type="button"
                onClick={() => setIsImagePromptOpen(true)}
                disabled={generateCoverImageMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-900 text-xs font-bold hover:bg-amber-400 transition disabled:opacity-50"
              >
                {generateCoverImageMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Generate with AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY IMAGES - NEW SECTION */}
      <section className="space-y-5">
        <SectionHeader
          title="Tour Gallery"
          description="Add additional images to showcase your tour experience."
        />

        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-700">
                {tourFormData.images?.length || 0} images uploaded
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                JPG, PNG or WebP · Max 5MB each
              </p>
            </div>

            <label
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition ${
                uploadMultipleImagesMutation.isPending
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              {uploadMultipleImagesMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {uploadMultipleImagesMutation.isPending ? "Uploading..." : "Add Images"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                multiple
                onChange={handleGalleryImagesUpload}
              />
            </label>
          </div>

          {tourFormData.images?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tourFormData.images.map((image, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                  <img
                    src={image.url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/95 backdrop-blur shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <ImageIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-500">No gallery images yet</p>
              <p className="text-[10px] text-slate-400 mt-1">
                Upload images to show more of the tour experience
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BUDGET BREAKDOWN */}
      <section className="space-y-5">
        <SectionHeader
          title="Budget Breakdown"
          description="Give travelers a simple breakdown of where the tour cost goes."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["hotel", "Hotel"],
            ["transport", "Transport"],
            ["food", "Food"],
            ["activities", "Activities"],
          ].map(([key, label]) => (
            <div key={key} className="rounded-xl border border-slate-200 p-4">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">
                {label}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                  PKR
                </span>
                <input
                  type="number"
                  min="0"
                  value={tourFormData.budgetBreakdown?.[key] || 0}
                  onChange={(e) => updateBudget(key, e.target.value)}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DAILY ITINERARY */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            title="Daily Itinerary"
            description="Plan what travelers will do each day."
          />
          <button
            type="button"
            onClick={addDay}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Day
          </button>
        </div>

        {tourFormData.itinerary?.length === 0 ? (
          <EmptySection
            icon={<Plus className="w-5 h-5" />}
            title="No itinerary days yet"
            description="Add the first day of your tour."
            action="Add Day"
            onClick={addDay}
          />
        ) : (
          <div className="space-y-4">
            {tourFormData.itinerary.map((dayItem, dayIndex) => (
              <div key={dayIndex} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                      {dayItem.day}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Day {dayItem.day}</p>
                      <p className="text-[10px] text-slate-400">Plan activities for this day</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDay(dayIndex)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Day Title">
                      <input
                        value={dayItem.title || ""}
                        onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                        placeholder="e.g. Explore Karimabad"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Location">
                      <input
                        value={dayItem.location || ""}
                        onChange={(e) => updateDay(dayIndex, "location", e.target.value)}
                        placeholder="e.g. Karimabad, Hunza"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={dayItem.description || ""}
                      onChange={(e) => updateDay(dayIndex, "description", e.target.value)}
                      placeholder="Describe what travelers will experience..."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs font-bold text-slate-700">Activities</p>
                        <p className="text-[10px] text-slate-400">
                          Add the main activities planned for this day.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addActivity(dayIndex)}
                        className="text-[11px] font-bold text-amber-700"
                      >
                        + Add Activity
                      </button>
                    </div>

                    <div className="space-y-3">
                      {dayItem.activities?.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
                          <p className="text-[11px] text-slate-400">No activities added yet.</p>
                        </div>
                      ) : (
                        dayItem.activities.map((activity, activityIndex) => {
                          const title = typeof activity === "object" ? activity?.title || "" : activity || "";
                          const image = typeof activity === "object" ? activity?.image : null;

                          return (
                            <div key={activityIndex} className="flex items-start gap-2">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-2">
                                {activityIndex + 1}
                              </div>

                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                      updateActivity(dayIndex, activityIndex, e.target.value)
                                    }
                                    placeholder="e.g. Visit Altit Fort"
                                    className={`${inputClass} flex-1`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeActivity(dayIndex, activityIndex)}
                                    className="p-2 text-slate-400 hover:text-red-500 shrink-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Activity Image Upload */}
                                <div className="flex items-center gap-2 pl-1">
                                  {image?.url ? (
                                    <div className="relative group">
                                      <img
                                        src={image.url}
                                        alt={`Activity ${activityIndex + 1}`}
                                        className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveActivityImage(dayIndex, activityIndex)}
                                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="cursor-pointer">
                                      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-amber-400 hover:text-amber-500 transition">
                                        <ImageIcon className="w-5 h-5" />
                                      </div>
                                      <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleActivityImageUpload(dayIndex, activityIndex, e)
                                        }
                                      />
                                    </label>
                                  )}
                                  <span className="text-[10px] text-slate-400">
                                    {image?.url ? "Image added" : "Add image"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* TRAVEL TIPS / IMPORTANT NOTES */}
      <section className="space-y-5">
        <SectionHeader
          title="Traveler Information"
          description="Add helpful information travelers should know before the trip."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ListEditor
            title="Travel Tips"
            description="Useful advice for travelers."
            items={tourFormData.travelTips || []}
            placeholder="e.g. Carry a light jacket for the evenings."
            onAdd={addTravelTip}
            onUpdate={updateTravelTip}
            onRemove={removeTravelTip}
          />

          <ListEditor
            title="Important Notes"
            description="Important rules, requirements or warnings."
            items={tourFormData.importantNotes || []}
            placeholder="e.g. Valid ID is required during the trip."
            onAdd={addImportantNote}
            onUpdate={updateImportantNote}
            onRemove={removeImportantNote}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            title="Frequently Asked Questions"
            description="Answer common questions travelers may have."
          />
          <button
            type="button"
            onClick={addFaq}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700"
          >
            <Plus className="w-3.5 h-3.5" />
            Add FAQ
          </button>
        </div>

        {tourFormData.faqs?.length === 0 ? (
          <EmptySection
            title="No FAQs yet"
            description="Add common questions to help travelers."
            action="Add FAQ"
            onClick={addFaq}
          />
        ) : (
          <div className="space-y-3">
            {tourFormData.faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-slate-700">Question {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Field label="Question">
                    <input
                      type="text"
                      value={faq.question || ""}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="e.g. What should I bring?"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Answer">
                    <textarea
                      rows={3}
                      value={faq.answer || ""}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Write a helpful answer..."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FINAL ACTIONS */}
      <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-white/95 backdrop-blur border-t border-slate-200 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleFinalSubmit("draft")}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && submittingStatus === "draft" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {editMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>{editMode ? "Update Draft" : "Keep in Draft"}</>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleFinalSubmit("published")}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && submittingStatus === "published" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {editMode ? "Updating..." : "Publishing..."}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {editMode ? "Update & Publish" : "Publish Tour"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI IMAGE PROMPT MODAL */}
      <AIImagePromptModal
        isOpen={isImagePromptOpen}
        onClose={() => setIsImagePromptOpen(false)}
        onGenerate={handleGenerateCoverImage}
        isGenerating={generateCoverImageMutation.isPending}
        defaultPrompt={defaultImagePrompt}
      />
    </div>
  );
};

// =============================================================
// SHARED UI
// =============================================================

const inputClass =
  "w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition placeholder:text-slate-300";

const SectionHeader = ({ title, description }) => (
  <div>
    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
    <p className="text-[11px] text-slate-400 mt-1">{description}</p>
  </div>
);

const Field = ({ label, required = false, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-2">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const EmptySection = ({ icon, title, description, action, onClick }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
    {icon && (
      <div className="w-9 h-9 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
        {icon}
      </div>
    )}
    <p className="text-xs font-bold text-slate-700">{title}</p>
    <p className="text-[10px] text-slate-400 mt-1">{description}</p>
    <button
      type="button"
      onClick={onClick}
      className="mt-4 text-[11px] font-bold text-amber-700 hover:text-amber-800"
    >
      + {action}
    </button>
  </div>
);

const ListEditor = ({
  title,
  description,
  items,
  placeholder,
  onAdd,
  onUpdate,
  onRemove,
}) => (
  <div className="rounded-2xl border border-slate-200 p-5">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h4 className="text-xs font-bold text-slate-800">{title}</h4>
        <p className="text-[10px] text-slate-400 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="shrink-0 text-[11px] font-bold text-amber-700"
      >
        + Add
      </button>
    </div>

    {items.length === 0 ? (
      <div className="rounded-xl bg-slate-50 p-4 text-center">
        <p className="text-[10px] text-slate-400">Nothing added yet.</p>
      </div>
    ) : (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
              {index + 1}
            </div>
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={placeholder}
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-2 text-slate-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default TourForm;