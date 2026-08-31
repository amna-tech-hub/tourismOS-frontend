import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Camera,
  Edit3,
  Image as ImageIcon,
  MapPin,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useJournalDetail,
  useAddJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from "../../api/queries/useTraveler";

import JournalEntryModal from "../../components/user/JournalEntryModal ";

const JournalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entryModalOpen, setEntryModalOpen] = useState(false);

  // Entry currently being edited
  const [editingEntry, setEditingEntry] = useState(null);

  const {
    data,
    isLoading,
    isError,
  } = useJournalDetail(id);

  const addEntryMutation = useAddJournalEntry();
  const updateJournalMutation = useUpdateJournalEntry();
  const deleteEntryMutation = useDeleteJournalEntry();

  const journal = data?.data?.journal;
  const entries = journal?.entries || [];

  const totalPhotos = useMemo(() => {
    return entries.reduce(
      (total, entry) =>
        total + (entry.photos?.length || 0),
      0
    );
  }, [entries]);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setEntryModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setEntryModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    if (
      addEntryMutation.isPending ||
      updateJournalMutation.isPending
    ) {
      return;
    }

    setEntryModalOpen(false);
    setEditingEntry(null);
  };

  // ==========================================
  // ADD / UPDATE MEMORY
  // ==========================================

  const handleEntrySubmit = async (payload) => {
    try {
      if (editingEntry) {
        // UPDATE EXISTING ENTRY
        await updateJournalMutation.mutateAsync({
          id,
          entryId: editingEntry._id,
          ...payload,
        });
      } else {
        // ADD NEW ENTRY
        await addEntryMutation.mutateAsync({
          id,
          ...payload,
        });
      }

      setEntryModalOpen(false);
      setEditingEntry(null);
    } catch (error) {
      console.error(
        "Journal entry save error:",
        error
      );
    }
  };

  // ==========================================
  // DELETE MEMORY
  // ==========================================

  const handleDeleteEntry = async (entryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this memory?"
    );

    if (!confirmed) return;

    try {
      await deleteEntryMutation.mutateAsync({
        id,
        entryId,
      });
    } catch (error) {
      console.error(
        "Delete journal entry error:",
        error
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-[var(--color-brand-primary)]"
        />
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (isError || !journal) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center mb-4">
          <BookOpen
            size={32}
            className="text-[var(--color-brand-primary)]"
          />
        </div>

        <h2 className="text-2xl font-serif font-semibold text-[var(--color-text-primary)]">
          Journal not found
        </h2>

        <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-md">
          This journal may have been deleted or you don't have access to it.
        </p>

        <button
          onClick={() => navigate("/journal")}
          className="btn-primary mt-6 gap-2"
        >
          <ArrowLeft size={17} />
          Back to Journals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/journal")}
        className="btn-ghost gap-2 mb-6 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-dark)]"
      >
        <ArrowLeft size={17} />
        My Journals
      </button>

      {/* JOURNAL HEADER */}
      <header className="overflow-hidden rounded-3xl">
        {journal.tour?.coverImage ? (
          <div className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-sm">
            <img
              src={journal.tour.coverImage}
              alt={
                journal.tour?.title ||
                "Travel journal"
              }
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="badge-yellow mb-3 inline-flex items-center gap-1.5 backdrop-blur-md bg-white/20 text-white border border-white/30">
                <BookOpen size={13} />
                Travel Journal
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold leading-tight text-white drop-shadow-sm">
                {journal.tour?.title || "My Journey"}
              </h1>

              {journal.tour?.destination && (
                <div className="flex items-center gap-2 mt-3 text-white/90 font-medium">
                  <MapPin size={17} className="text-[var(--color-brand-primary)]" />
                  <span>{journal.tour.destination}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--color-brand-primary)] mb-2">
              <BookOpen size={20} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Travel Journal
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-text-primary)]">
              {journal.tour?.title || "My Journey"}
            </h1>

            {journal.tour?.destination && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mt-3">
                <MapPin size={16} className="text-[var(--color-brand-primary)]" />
                {journal.tour.destination}
              </div>
            )}
          </div>
        )}

        {/* META BAR */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-5 px-2 border-b border-[var(--color-border-subtle)] text-sm text-[var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-2 font-medium">
            <BookOpen size={16} className="text-[var(--color-brand-primary)]" />
            {entries.length}{" "}
            {entries.length === 1 ? "memory" : "memories"}
          </span>

          <span className="inline-flex items-center gap-2 font-medium">
            <ImageIcon size={16} className="text-[var(--color-brand-primary)]" />
            {totalPhotos}{" "}
            {totalPhotos === 1 ? "photo" : "photos"}
          </span>

          <span className="inline-flex items-center gap-2 font-medium">
            <Calendar size={16} className="text-[var(--color-brand-primary)]" />
            {new Date(journal.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* ADD MEMORY ACTION */}
      <div className="flex items-center justify-between py-8">
        <div>
          <h3 className="section-title">Timeline & Memories</h3>
          <p className="section-description">Captured moments and expenses from this trip.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary gap-2"
        >
          <Plus size={18} />
          Add Memory
        </button>
      </div>

      {/* ENTRIES LIST */}
      {entries.length === 0 ? (
        <div className="card-soft py-16 text-center border-dashed border-2 border-[var(--color-border-medium)]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
            <Camera
              size={30}
              className="text-[var(--color-brand-primary)]"
            />
          </div>

          <h2 className="mt-5 text-xl font-serif font-semibold text-[var(--color-text-primary)]">
            Your story starts here
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
            Add your first memory, photos and expenses from this journey to preserve your experience.
          </p>

          <button
            onClick={handleOpenAdd}
            className="btn-primary mt-6 gap-2"
          >
            <Plus size={17} />
            Add First Memory
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {entries.map((entry, index) => (
            <article
              key={entry._id}
              className="card p-6 sm:p-8 hover:shadow-md transition-all duration-200"
            >
              {/* DAY & TITLE HEADER */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-yellow">
                      Day {entry.day}
                    </span>
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">
                      Memory {index + 1}
                    </span>
                  </div>

                  <h2 className="text-2xl font-serif font-semibold text-[var(--color-text-primary)]">
                    {entry.title}
                  </h2>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(entry)}
                    disabled={
                      updateJournalMutation.isPending ||
                      deleteEntryMutation.isPending
                    }
                    title="Edit memory"
                    className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-soft)] transition disabled:opacity-50"
                  >
                    <Edit3 size={17} />
                  </button>

                  <button
                    onClick={() => handleDeleteEntry(entry._id)}
                    disabled={
                      deleteEntryMutation.isPending ||
                      updateJournalMutation.isPending
                    }
                    title="Delete memory"
                    className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-soft)] transition disabled:opacity-50"
                  >
                    {deleteEntryMutation.isPending ? (
                      <Loader2
                        size={17}
                        className="animate-spin text-[var(--color-error)]"
                      />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* MEMORY BODY */}
              <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {entry.memory}
              </p>

              {/* PHOTOS GRID */}
              {entry.photos?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
                  {entry.photos.map((photo) => (
                    <div
                      key={photo._id || photo.public_id}
                      className="aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]"
                    >
                      <img
                        src={photo.url}
                        alt={entry.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* EXPENSES BREAKDOWN */}
              {entry.expenses?.length > 0 && (
                <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)] max-w-xl">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Expenses Summary
                  </h3>

                  <div className="space-y-2.5">
                    {entry.expenses.map((expense, expenseIndex) => (
                      <div
                        key={expenseIndex}
                        className="flex items-center justify-between gap-4 text-sm bg-[var(--color-bg-secondary)] p-3 rounded-xl border border-[var(--color-border-subtle)]"
                      >
                        <span className="text-[var(--color-text-secondary)] capitalize font-medium">
                          {expense.category}
                          {expense.note && (
                            <span className="text-[var(--color-text-muted)] font-normal ml-2">
                              — {expense.note}
                            </span>
                          )}
                        </span>

                        <span className="font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
                          PKR{" "}
                          {Number(
                            expense.amount || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <JournalEntryModal
        isOpen={entryModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleEntrySubmit}
        isProcessing={
          addEntryMutation.isPending ||
          updateJournalMutation.isPending
        }
        error={
          addEntryMutation.error ||
          updateJournalMutation.error
        }
        existingEntryCount={entries.length}
        editEntry={editingEntry}
      />
    </div>
  );
};

export default JournalDetail;