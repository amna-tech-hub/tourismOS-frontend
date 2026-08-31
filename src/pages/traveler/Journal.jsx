import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Camera,
  MapPin,
  Calendar,
  Plus,
  Loader2,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import {
  useMyJournals,
  useCreateJournal,
} from "../../api/queries/useTraveler";

import { useMyBookings } from "../../api/queries/useBooking";

import CreateJournalModal from "../../components/user/CreateJournalModal";

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Journal = () => {
  const navigate = useNavigate();

  // ==========================================
  // JOURNALS
  // ==========================================

  const {
    data: journalData,
    isLoading: journalsLoading,
    isError: journalsError,
  } = useMyJournals();

  // ==========================================
  // BOOKINGS
  // ==========================================

  const {
    data: bookingData,
    isLoading: bookingsLoading,
  } = useMyBookings({
    limit: 100,
  });

  // ==========================================
  // CREATE JOURNAL MUTATION
  // ==========================================

  const createJournalMutation = useCreateJournal();

  // ==========================================
  // STATE
  // ==========================================

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  // ==========================================
  // JOURNALS DATA
  // ==========================================

  const journals = journalData?.data?.journals || [];

  // ==========================================
  // BOOKINGS DATA
  // ==========================================

  const bookings = useMemo(() => {
    return (
      bookingData?.data?.bookings ||
      bookingData?.data ||
      []
    );
  }, [bookingData]);

  // ==========================================
  // EXISTING JOURNAL BOOKING IDS
  // ==========================================

  const journalBookingIds = useMemo(() => {
    return new Set(
      journals
        .map(
          (journal) =>
            journal.booking?._id ||
            journal.booking
        )
        .filter(Boolean)
        .map((id) => id.toString())
    );
  }, [journals]);

  // ==========================================
  // ELIGIBLE BOOKINGS
  // ==========================================

  const eligibleBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const isConfirmed =
        booking.status?.toLowerCase() ===
        "confirmed";

      const isPaid =
        booking.paymentStatus?.toLowerCase() ===
        "paid";

      const alreadyHasJournal =
        journalBookingIds.has(
          booking._id?.toString()
        );

      return (
        isConfirmed &&
        isPaid &&
        !alreadyHasJournal
      );
    });
  }, [
    bookings,
    journalBookingIds,
  ]);

  // ==========================================
  // CREATE JOURNAL
  // ==========================================

  const handleCreateJournal = async ({
    bookingId,
  }) => {
    try {
      const response =
        await createJournalMutation.mutateAsync({
          bookingId,
        });

      // ------------------------------------------
      // GET CREATED JOURNAL
      // ------------------------------------------

      const createdJournal =
        response?.data?.journal ||
        response?.journal;

      if (!createdJournal?._id) {
        console.error(
          "Journal created but journal ID was not returned:",
          response
        );

        return;
      }

      // ------------------------------------------
      // CLOSE MODAL
      // ------------------------------------------

      setShowCreateModal(false);

      // ------------------------------------------
      // REDIRECT TO JOURNAL DETAIL
      // ------------------------------------------
console.log(createdJournal,"creted journel");

      navigate(
        `journals/${createdJournal.booking._id}`
      );
    } catch (error) {
      console.error(
        "Create journal error:",
        error
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (
    journalsLoading ||
    bookingsLoading
  ) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2
            className="animate-spin"
            size={30}
          />

          <p>
            Loading your travel journal...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (journalsError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <BookOpen
            size={48}
            className="mx-auto text-slate-300 mb-4"
          />

          <h2 className="text-xl font-semibold text-slate-900">
            Unable to load your journal
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Something went wrong while loading
            your travel memories.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (journals.length === 0) {
    const hasBookings =
      bookings.length > 0;

    return (
      <>
        <div className="min-h-[75vh] flex items-center justify-center px-4">
          <div className="max-w-lg text-center">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-yellow-50 flex items-center justify-center mb-6">
              <BookOpen
                size={38}
                className="text-yellow-400"
              />
            </div>

            <h1 className="text-3xl font-serif font-semibold text-slate-900">
              Your travel journal is waiting
            </h1>

            <p className="text-slate-500 mt-3 leading-relaxed">
              {hasBookings
                ? "Once you have a confirmed and paid tour, you can create a journal and start saving your favorite moments, photos and experiences."
                : "Your memories deserve a place of their own. Book a tour and you'll be able to save your favorite moments, photos and experiences in your personal travel journal."}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-7">

              {/* EXPLORE TOURS */}

              <button
                onClick={() => {
                  navigate("/");
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-white font-medium transition"
              >
              

                {hasBookings
                  ? "Explore More Tours"
                  : "Explore Tours"}
              </button>

              {/* CREATE JOURNAL */}

              {eligibleBookings.length > 0 && (
                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-yellow-200 text-yellow-600 hover:bg-yellow-50 font-medium transition"
                >
                  <Plus size={18} />
                  Create Journal
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CREATE JOURNAL MODAL */}

        {showCreateModal && (
          <CreateJournalModal
            bookings={eligibleBookings}
            onClose={() =>
              setShowCreateModal(false)
            }
            onSubmit={handleCreateJournal}
            isProcessing={
              createJournalMutation.isPending
            }
            error={
              createJournalMutation.error
            }
          />
        )}
      </>
    );
  }

  // ==========================================
  // JOURNAL LIST
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

        <div>
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <BookOpen size={20} />

            <span className="text-sm font-medium">
              My Memories
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900">
            My Travel Journal
          </h1>

          <p className="text-slate-500 mt-2">
            Keep the memories of your adventures
            in one place.
          </p>
        </div>

        {/* NEW JOURNAL */}

        <button
          onClick={() =>
            setShowCreateModal(true)
          }
          disabled={
            eligibleBookings.length === 0
          }
          title={
            eligibleBookings.length === 0
              ? "You need a confirmed and paid booking first."
              : "Create a new journal"
          }
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          New Journal
        </button>
      </div>

      {/* INFO */}

      {eligibleBookings.length === 0 && (
        <div className="mb-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 flex items-start gap-3">

          <CheckCircle2
            size={20}
            className="text-yellow-400 mt-0.5 shrink-0"
          />

          <div>
            <p className="font-medium text-slate-800">
              No new journals available
            </p>

            <p className="text-sm text-slate-600 mt-1">
              Journals are created for confirmed
              and paid bookings. If you already
              have a journal for your booking,
              you can continue adding memories
              to it.
            </p>
          </div>
        </div>
      )}

      {/* JOURNAL CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {journals.map((journal) => {
          const photos =
            journal.entries?.flatMap(
              (entry) =>
                entry.photos || []
            ) || [];

          const firstPhoto =
            photos.find(
              (photo) => photo?.url
            )?.url ||
            journal.tour?.coverImage?.url;

          return (
            <button
              key={journal._id}
              onClick={() =>
                navigate(
                  `/journals/${journal._id}`
                )
              }
              className="group text-left bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >

              {/* COVER */}

              <div className="relative h-52 bg-slate-100 overflow-hidden">

                {firstPhoto ? (
                  <img
                    src={firstPhoto}
                    alt={
                      journal.tour?.title ||
                      "Travel memory"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-50">
                    <Camera
                      size={40}
                      className="text-yellow-400"
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">

                  <h2 className="font-semibold text-lg line-clamp-1">
                    {journal.tour?.title ||
                      "My Trip"}
                  </h2>

                  {journal.tour?.destination && (
                    <div className="flex items-center gap-1 text-sm text-white/80 mt-1">
                      <MapPin size={14} />
                      {journal.tour.destination}
                    </div>
                  )}
                </div>
              </div>

              {/* CONTENT */}

              <div className="p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <BookOpen size={16} />

                    {journal.entries?.length ||
                      0}{" "}
                    memories
                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-yellow-400 transition"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                  <Calendar size={14} />

                  Created{" "}
                  {formatDate(
                    journal.createdAt
                  )}
                </div>

              </div>
            </button>
          );
        })}
      </div>

      {/* CREATE JOURNAL MODAL */}

      {showCreateModal && (
        <CreateJournalModal
          bookings={eligibleBookings}
          onClose={() =>
            setShowCreateModal(false)
          }
          onSubmit={handleCreateJournal}
          isProcessing={
            createJournalMutation.isPending
          }
          error={
            createJournalMutation.error
          }
        />
      )}
    </div>
  );
};

export default Journal;