// src/pages/employee/Tours.jsx

import React, { useMemo, useState, useEffect } from "react";

import {
  Plus,
  Search,
  Map,
  Edit3,
  Trash2,
  Eye,
  Globe2,
  FileEdit,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Sparkles,
} from "lucide-react";

import {
  useMyTours,
  useDeleteMyTour,
  usePublishMyTour,
} from "../../api/queries/useEmployee";

import CreateTour from "../../components/tour/CreateTour";
import TourCard from "../../components/tour/TourCard";
import TourDetails from "../shared/tours/ViewTour";

// ======================================================
// HELPERS
// ======================================================

const formatNumber = (number = 0) => {
  return new Intl.NumberFormat("en-US").format(number);
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({ title, value, icon: Icon, iconClass }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
};

// ======================================================
// DELETE MODAL
// ======================================================

const DeleteModal = ({ tour, isDeleting, onCancel, onConfirm }) => {
  if (!tour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
          <Trash2 size={20} />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-900">
          Delete tour?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">"{tour.title}"</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="btn-outline cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-rose-500 px-5 py-3 font-medium text-white hover:bg-rose-600 disabled:pointer-events-none disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} className="mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const EmployeeTours = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [deletingTour, setDeletingTour] = useState(null);

  const [selectedTour, setSelectedTour] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // ====================================================
  // RESET PAGE WHEN SEARCH / FILTER CHANGES
  // ====================================================

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // ====================================================
  // QUERY
  // ====================================================

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMyTours({
    page,
    limit,
    search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // ====================================================
  // MUTATIONS
  // ====================================================

  const deleteTourMutation = useDeleteMyTour();
  const publishTourMutation = usePublishMyTour();

  // ====================================================
  // API DATA
  // ====================================================

  const tours = response?.data || [];
  const meta = response?.meta || {};

  // ====================================================
  // STATS
  // ====================================================

  const stats = useMemo(() => {
    const total = meta.totalDocuments ?? tours.length;
    const published = tours.filter((t) => t.status === "published").length;
    const drafts = tours.filter((t) => t.status === "draft").length;

    return { total, published, drafts };
  }, [tours, meta.totalDocuments]);

  // ====================================================
  // HANDLERS
  // ====================================================

  const handleSearch = (value) => setSearch(value);

  const handleStatusFilterChange = (value) => setStatusFilter(value);

  const handleCreateTour = () => {
    setEditingTour(null);
    setIsCreateOpen(true);
  };

  const handleEdit = (tour) => {
    if (!tour) return;
    setEditingTour(tour);
    setIsCreateOpen(true);
  };

  const handleViewTour = (tour) => {
    setSelectedTour(tour);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedTour(null);
  };

  const handleCloseCreateTour = () => {
    setIsCreateOpen(false);
    setEditingTour(null);
  };

  const handleTourSuccess = async () => {
    setIsCreateOpen(false);
    setEditingTour(null);
    await refetch();
  };

  const handleDelete = async () => {
    if (!deletingTour) return;
    try {
      await deleteTourMutation.mutateAsync(deletingTour._id);
      setDeletingTour(null);
      await refetch();
    } catch (error) {
      console.error("Delete Tour Error:", error);
    }
  };

  const handlePublish = async (tour) => {
    if (!tour?._id) return;
    try {
      await publishTourMutation.mutateAsync(tour._id);
      await refetch();
    } catch (error) {
      console.error("Publish Tour Error:", error);
    }
  };

  // ====================================================
  // ERROR
  // ====================================================

  if (isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <AlertCircle size={24} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load tours
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading your tours.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary mt-5 cursor-pointer"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-yellow-600">Employee Portal</p>
            <span className="badge-yellow">My Tours</span>
          </div>

          <h1 className="mt-1 text-3xl font-semibold text-slate-900">My Tours</h1>

          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Create, manage, and publish your travel experiences for your company.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateTour}
          className="btn-primary self-start cursor-pointer sm:self-auto"
        >
          <Plus size={17} className="mr-2" />
          Create Tour
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="My Tours"
          value={formatNumber(stats.total)}
          icon={Map}
          iconClass="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          title="Published"
          value={formatNumber(stats.published)}
          icon={Globe2}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Drafts"
          value={formatNumber(stats.drafts)}
          icon={FileEdit}
          iconClass="bg-slate-100 text-slate-600"
        />
      </div>

      {/* TOOLBAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search your tours, destinations..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
            />
            {isFetching && search && (
              <Loader2
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
              />
            )}
            {search && !isFetching && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* FILTER + REFRESH */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              <Filter size={15} className="ml-2 mr-1 text-slate-400" />
              {[
                ["all", "All"],
                ["published", "Published"],
                ["draft", "Drafts"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStatusFilterChange(value)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium ${
                    statusFilter === value
                      ? "bg-white text-slate-900"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* INITIAL LOADING / EMPTY / GRID */}
      {isLoading && tours.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={30} className="animate-spin text-yellow-500" />
            <p className="text-sm text-slate-500">Loading your tours...</p>
          </div>
        </div>
      ) : tours.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
            <Map size={27} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            {search || statusFilter !== "all"
              ? "No tours found"
              : "Create your first tour"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {search || statusFilter !== "all"
              ? "Try changing your search or filter to find what you're looking for."
              : "Create a beautiful travel experience for your company's customers using our manual or AI-powered tour creation flow."}
          </p>

          {!search && statusFilter === "all" && (
            <button
              type="button"
              onClick={handleCreateTour}
              className="btn-primary mt-6 cursor-pointer"
            >
              <Sparkles size={16} className="mr-2" />
              Create Tour
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="pointer-events-none absolute right-2 -top-2 z-10">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm">
                <Loader2 size={13} className="animate-spin" />
                Updating...
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tours.map((tour) => (
              <TourCard
                key={tour._id || tour.id}
                tour={tour}
                userRole="employee"
                onView={handleViewTour}
                onEdit={handleEdit}
                onDelete={setDeletingTour}
                onPublish={handlePublish}
              />
            ))}
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {tours.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">{tours.length}</span>{" "}
            tour{tours.length !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-yellow-500 px-3 text-xs font-semibold text-white">
              {page}
            </span>

            <button
              type="button"
              disabled={
                isFetching ||
                (meta.totalPages
                  ? page >= meta.totalPages
                  : tours.length < limit)
              }
              onClick={() => setPage((prev) => prev + 1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      <DeleteModal
        tour={deletingTour}
        isDeleting={deleteTourMutation.isPending}
        onCancel={() => setDeletingTour(null)}
        onConfirm={handleDelete}
      />

      {/* CREATE / EDIT TOUR */}
      <CreateTour
        isOpen={isCreateOpen}
        onClose={handleCloseCreateTour}
        onSuccess={handleTourSuccess}
        editTour={editingTour}
        userRole="employee"
      />

      {/* VIEW TOUR */}
      <TourDetails
        isOpen={isViewOpen}
        tourId={selectedTour?._id}
        onClose={handleCloseView}
        userRole="employee"
      />
    </div>
  );
};

export default EmployeeTours;