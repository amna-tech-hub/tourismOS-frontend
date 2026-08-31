import React from "react";
import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  ArrowRight,
  Lock,
  Globe,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const JournalCard = ({ journal }) => {
  const navigate = useNavigate();

  const entries = journal.entries || [];

  const photo =
    entries
      .flatMap((entry) => entry.photos || [])
      .find((photo) => photo?.url)?.url ||
    journal.tour?.coverImage;

  const totalPhotos = entries.reduce(
    (total, entry) =>
      total + (entry.photos?.length || 0),
    0
  );

  const totalEntries = entries.length;

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">

      {/* Image */}
      <div className="relative h-56 bg-slate-100 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={journal.tour?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon
              size={42}
              className="text-slate-300"
            />
          </div>
        )}

        {/* Privacy */}
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-slate-700">
            {journal.isPublic ? (
              <>
                <Globe size={13} />
                Public
              </>
            ) : (
              <>
                <Lock size={13} />
                Private
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
          {journal.tour?.title || "My Journey"}
        </h3>

        {journal.tour?.destination && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
            <MapPin size={15} />
            {journal.tour.destination}
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <BookOpen size={14} />
            {totalEntries} memories
          </span>

          <span className="flex items-center gap-1">
            <ImageIcon size={14} />
            {totalPhotos} photos
          </span>
        </div>

        <button
          onClick={() =>
            navigate(
              `/traveler/journals/${journal._id}`
            )
          }
          className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
        >
          Open Journal
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default JournalCard;