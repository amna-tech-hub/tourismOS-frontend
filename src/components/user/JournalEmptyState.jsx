import React from "react";
import { BookOpen, Compass, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JournalEmptyState = ({ type, onCreate }) => {
  const navigate = useNavigate();

  if (type === "no-bookings") {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center">
          <Compass size={30} className="text-yellow-400" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-slate-900">
          Your travel story starts here
        </h2>

        <p className="max-w-md mx-auto mt-2 text-sm text-slate-500 leading-6">
          You haven't booked a tour yet. Book your first adventure and you'll be
          able to create a personal journal, add photos, and save your favorite
          memories.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600"
        >
          Explore Tours
        </button>
      </div>
    );
  }

  if (type === "not-confirmed") {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
        <CalendarCheck size={42} className="mx-auto text-slate-300" />

        <h2 className="mt-5 text-xl font-semibold">
          Your journal is waiting for your adventure
        </h2>

        <p className="max-w-md mx-auto mt-2 text-sm text-slate-500">
          Once your tour booking is confirmed, you'll be able to create a
          journal and start saving your memories.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
      <BookOpen size={42} className="mx-auto text-slate-300" />

      <h2 className="mt-5 text-xl font-semibold">Your journal is empty</h2>

      <p className="mt-2 text-sm text-slate-500">
        Start recording the memories from your trip.
      </p>

      {onCreate && (
        <button
          onClick={onCreate}
          className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 text-white"
        >
          Create Journal
        </button>
      )}
    </div>
  );
};

export default JournalEmptyState;
