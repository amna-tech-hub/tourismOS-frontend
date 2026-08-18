import React, { useEffect, useState } from "react";
import {
  Sparkles,
  X,
  Loader2,
} from "lucide-react";

const AIImagePromptModal = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false,
  defaultPrompt = "",
}) => {
  const [prompt, setPrompt] = useState(
    defaultPrompt
  );

  useEffect(() => {
    if (isOpen) {
      setPrompt(defaultPrompt);
    }
  }, [isOpen, defaultPrompt]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    onGenerate(prompt.trim());
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Generate Cover Image
              </h3>

              <p className="text-[11px] text-slate-500 mt-1">
                Describe the image you want AI to create.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          <div>

            <label className="block text-xs font-bold text-slate-700 mb-2">
              Image Prompt
            </label>

            <textarea
              rows={6}
              value={prompt}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              placeholder="Describe the destination, scenery, atmosphere, lighting and photography style..."
              disabled={isGenerating}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl resize-none outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition disabled:bg-slate-50"
            />

          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">

            <p className="text-[10px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700">
                Tip:
              </span>{" "}
              Mention the location, scenery, mood,
              lighting and visual style for better results.
            </p>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !prompt.trim() ||
                isGenerating
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-amber-500 text-slate-900 rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Image
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AIImagePromptModal;