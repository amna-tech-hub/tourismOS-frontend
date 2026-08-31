import React, { useEffect, useState } from "react";
import {
  X,
  ImagePlus,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  Sparkles,
  Receipt,
  Camera,
} from "lucide-react";

import { useUploadMultipleImages } from "../../api/queries/useUpload";

const EXPENSE_CATEGORIES = [
  "food",
  "hotel",
  "transport",
  "shopping",
  "activities",
  "other",
];

const INITIAL_EXPENSE = {
  category: "food",
  amount: "",
  note: "",
};

const JournalEntryModal = ({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
  error,
  editEntry = null,
  existingEntryCount = 0,
}) => {
  const isEditMode = Boolean(editEntry);

  const [day, setDay] = useState(existingEntryCount + 1);
  const [title, setTitle] = useState("");
  const [memory, setMemory] = useState("");
  const [photos, setPhotos] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [expense, setExpense] = useState({
    ...INITIAL_EXPENSE,
  });

  const uploadImagesMutation = useUploadMultipleImages();

  // Handle escape key to close modal safely
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  // Initialize / Prefill form
  useEffect(() => {
    if (!isOpen) return;

    if (editEntry) {
      setDay(editEntry.day ?? 1);
      setTitle(editEntry.title ?? "");
      setMemory(editEntry.memory ?? "");

      setPhotos(
        Array.isArray(editEntry.photos)
          ? editEntry.photos
              .map((photo) => ({
                url: photo.url || photo.secure_url || "",
                public_id:
                  photo.public_id || photo.publicId || photo._id || "",
              }))
              .filter((photo) => photo.url)
          : []
      );

      setExpenses(
        Array.isArray(editEntry.expenses)
          ? editEntry.expenses.map((item) => ({
              category: item.category || "other",
              amount: Number(item.amount || 0),
              note: item.note || "",
            }))
          : []
      );

      setExpense({ ...INITIAL_EXPENSE });
      return;
    }

    // Add Mode
    setDay(existingEntryCount + 1);
    setTitle("");
    setMemory("");
    setPhotos([]);
    setExpenses([]);
    setExpense({ ...INITIAL_EXPENSE });
  }, [isOpen, editEntry, existingEntryCount]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const response = await uploadImagesMutation.mutateAsync(files);
      const uploadedImages =
        response?.data?.images || response?.images || response?.data || [];

      if (!Array.isArray(uploadedImages)) {
        throw new Error("Invalid image upload response.");
      }

      const normalizedImages = uploadedImages
        .map((image) => ({
          url: image.url || image.secure_url,
          public_id: image.public_id || image.publicId,
        }))
        .filter((image) => image.url && image.public_id);

      setPhotos((previous) => [...previous, ...normalizedImages]);
    } catch (uploadError) {
      console.error("Journal image upload failed:", uploadError);
    } finally {
      event.target.value = "";
    }
  };

  const removePhoto = (index) => {
    setPhotos((previous) => previous.filter((_, i) => i !== index));
  };

  const addExpense = () => {
    const amount = Number(expense.amount);
    if (!expense.amount || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    setExpenses((previous) => [
      ...previous,
      {
        category: expense.category,
        amount,
        note: expense.note.trim(),
      },
    ]);

    setExpense({ ...INITIAL_EXPENSE });
  };

  const removeExpense = (index) => {
    setExpenses((previous) => previous.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedMemory = memory.trim();

    if (!day || Number(day) < 1 || !trimmedTitle || !trimmedMemory) {
      return;
    }

    try {
      await onSubmit({
        ...(isEditMode && { entryId: editEntry._id }),
        day: Number(day),
        title: trimmedTitle,
        memory: trimmedMemory,
        photos,
        expenses,
      });
    } catch (submitError) {
      console.error("Save journal entry failed:", submitError);
    }
  };

  const isUploading = uploadImagesMutation.isPending;
  const isBusy = isProcessing || isUploading;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-yellow-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-50 text-yellow-400 border border-yellow-100/60">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {isEditMode ? "Edit Travel Memory" : "Add New Memory"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isEditMode
                  ? "Update your entry, attached photos and expenses."
                  : "Capture a special moment from your trip."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Day & Title Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                Day
              </label>
              <input
                type="number"
                min="1"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Memory Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hiking through the misty mountains"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition"
                required
              />
            </div>
          </div>

          {/* Memory Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Your Story
            </label>
            <textarea
              rows={4}
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="What made today special? Describe the sights, sounds, and feelings..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition resize-none text-sm leading-relaxed"
              required
            />
          </div>

          {/* Photos Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <Camera className="w-4 h-4 text-yellow-400" />
                Photos
              </label>
              {photos.length > 0 && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {photos.length} uploaded
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={photo.public_id || index}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-sm"
                >
                  <img
                    src={photo.url}
                    alt="Travel memory detail"
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    disabled={isBusy}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/70 backdrop-blur-sm text-white hover:bg-red-500 transition disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label
                className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/40 cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-yellow-400 transition group ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin text-yellow-400" />
                    <span className="text-[11px] font-medium mt-1.5 text-slate-500">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={20} className="group-hover:scale-110 transition duration-200" />
                    <span className="text-[11px] font-medium mt-1.5">Add Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isUploading}
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <Receipt className="w-4 h-4 text-yellow-400" />
                Expenses
              </label>
            </div>

            {/* Input Row for adding expenses */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <select
                  value={expense.category}
                  onChange={(e) =>
                    setExpense((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium capitalize outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0"
                  placeholder="Amount"
                  value={expense.amount}
                  onChange={(e) =>
                    setExpense((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition"
                />

                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={expense.note}
                  onChange={(e) =>
                    setExpense((prev) => ({ ...prev, note: e.target.value }))
                  }
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={addExpense}
                  disabled={isBusy || !expense.amount}
                  className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-yellow-400/20"
                >
                  <Plus size={14} />
                  Add Expense
                </button>
              </div>
            </div>

            {/* List of Added Expenses */}
            {expenses.length > 0 && (
              <div className="mt-3 space-y-2">
                {expenses.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 capitalize">
                        {item.category}
                      </p>
                      {item.note && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {item.note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-slate-900">
                        PKR {Number(item.amount || 0).toLocaleString()}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeExpense(index)}
                        disabled={isBusy}
                        className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {(error || uploadImagesMutation.error) && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {uploadImagesMutation.error?.response?.data?.message ||
                error?.response?.data?.message ||
                error?.message ||
                uploadImagesMutation.error?.message ||
                "Unable to save memory."}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 active:bg-slate-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-white font-medium text-sm flex items-center justify-center transition disabled:opacity-50 shadow-md shadow-yellow-400/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : isUploading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : isEditMode ? (
                "Update Memory"
              ) : (
                "Save Memory"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalEntryModal;