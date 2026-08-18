// src/pages/super-admin/Tours.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Sparkles,
  FileText,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
  ChevronDown,
} from "lucide-react";

import TourCard from "../../components/tour/TourCard";
import CreateTour from "../../components/tour/CreateTour";
import TourDetails from "../shared/tours/ViewTour";

import {
  useCompanyTours,
  useDeleteTour,
  usePublishTour,
} from "../../api/queries/useTraveler";
import { useSuperAdminCompanies } from "../../api/queries/useSuperAdmin";

// =========================================================
// NEW: Hook to fetch companies for super admin
// =========================================================

const Tours = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [selectedTour, setSelectedTour] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState(""); // ✅ Changed from companyFilter

  const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);
  const [editTour, setEditTour] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Super Admin role
  const userRole = "super_admin";

  const [deleteTour, setDeleteTour] = useState(null);
  const [publishTour, setPublishTour] = useState(null);

  // =========================================================
  // API - Fetch Tours with filters
  // =========================================================

  const {
    data: companyToursResponse,
    isLoading: isLoadingTours,
    isError: isToursError,
    refetch: refetchTours,
  } = useCompanyTours({
    page: currentPage,
    limit: itemsPerPage,
    search: search,
    status: statusFilter,
    companyId: selectedCompanyId, // ✅ Pass the selected company ID
  });

  // =========================================================
  // API - Fetch Companies for filter dropdown
  // =========================================================
  
  const {
    data: companiesResponse,
    isLoading: isLoadingCompanies,
  } = useSuperAdminCompanies();

  // Extract companies array from response
  const companies = useMemo(() => {
    return companiesResponse?.data || [];
  }, [companiesResponse]);

  console.log(companyToursResponse, "response of company tour");

  const deleteMutation = useDeleteTour();
  const publishMutation = usePublishTour();

  // =========================================================
  // DATA
  // =========================================================

  const tours = useMemo(() => {
    console.log("COMPANY TOURS RESPONSE:", companyToursResponse);

    if (Array.isArray(companyToursResponse?.data)) {
      return companyToursResponse.data;
    }

    if (Array.isArray(companyToursResponse)) {
      return companyToursResponse;
    }

    return [];
  }, [companyToursResponse]);

  const paginationMeta = useMemo(() => {
    return companyToursResponse?.meta || {
      totalDocuments: 0,
      totalPages: 1,
      currentPage: 1,
      limit: itemsPerPage,
    };
  }, [companyToursResponse, itemsPerPage]);

  const totalItems = paginationMeta.totalDocuments;
  const totalPages = paginationMeta.totalPages || Math.ceil(totalItems / itemsPerPage);

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleCreateTour = () => {
    setEditTour(null);
    setIsCreateTourOpen(true);
  };

  const handleViewTour = (tour) => {
    setSelectedTour(tour);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedTour(null);
  };

  const handleEdit = (tour) => {
    setEditTour(tour);
    setIsCreateTourOpen(true);
  };

  const handleTourSuccess = () => {
    refetchTours();
    setIsCreateTourOpen(false);
    setEditTour(null);
  };

  const handleDelete = (tour) => {
    setDeleteTour(tour);
  };

  const confirmDelete = async () => {
    if (!deleteTour?._id) return;

    try {
      await deleteMutation.mutateAsync(deleteTour._id);
      setDeleteTour(null);
      refetchTours();
    } catch (error) {
      console.error("Failed to delete tour:", error);
    }
  };

  const handlePublishTour = (tour) => {
    setPublishTour(tour);
  };

  const confirmPublish = async () => {
    if (!publishTour?._id) return;

    try {
      await publishMutation.mutateAsync(publishTour._id);
      setPublishTour(null);
      refetchTours();
    } catch (error) {
      console.error("Failed to publish tour:", error);
    }
  };

  // =========================================================
  // PAGINATION HELPERS
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, selectedCompanyId]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById("tours-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = Number(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    refetchTours();
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const publishedTours = useMemo(() => {
    return tours.filter((tour) => tour?.status === "published");
  }, [tours]);

  const draftTours = useMemo(() => {
    return tours.filter((tour) => tour?.status === "draft");
  }, [tours]);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-bg-secondary px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl" id="tours-section">
        
        {/* HEADER */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
             
              <div>
                <h1 className="font-serif text-3xl font-bold text-text-primary">
                  Tours Management
                </h1>
                <p className="subheading text-sm">
                  Manage all tours across all companies
                </p>
              </div>
            </div>
          </div>

        <button
  type="button"
  onClick={handleCreateTour}
            className="btn-yellow text-xs py-2.5 px-4 gap-2 shadow-sm"
>
  <Plus className="h-4 w-4" />
  Create New Tour
</button>
        </div>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-bg-card p-6 shadow-sm ring-1 ring-border-subtle">
            <p className="subheading text-sm">Total Tours</p>
            <p className="mt-2 font-serif text-3xl font-bold text-text-primary">
              {paginationMeta.totalDocuments || tours.length}
            </p>
            <div className="mt-3 h-1 w-16 rounded-full bg-amber-primary/30" />
          </div>

          <div className="rounded-2xl bg-bg-card p-6 shadow-sm ring-1 ring-border-subtle">
            <p className="subheading text-sm">Published</p>
            <p className="mt-2 font-serif text-3xl font-bold text-success">
              {tours.filter((t) => t?.status === "published").length}
            </p>
            <div className="mt-3 h-1 w-16 rounded-full bg-success/30" />
          </div>

          <div className="rounded-2xl bg-bg-card p-6 shadow-sm ring-1 ring-border-subtle">
            <p className="subheading text-sm">Drafts</p>
            <p className="mt-2 font-serif text-3xl font-bold text-warning">
              {tours.filter((t) => t?.status === "draft").length}
            </p>
            <div className="mt-3 h-1 w-16 rounded-full bg-warning/30" />
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="mt-8 rounded-2xl bg-bg-card p-4 shadow-sm ring-1 ring-border-subtle">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            
            {/* SEARCH */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tours by title, destination..."
                className="w-full rounded-xl border-0 bg-bg-secondary py-3 pl-11 pr-10 font-sans text-sm text-text-primary outline-none ring-1 ring-border-subtle transition-all placeholder:text-text-muted focus:bg-bg-card focus:ring-2 focus:ring-amber-primary/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-muted transition-colors hover:bg-bg-tertiary hover:text-text-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* FILTERS */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter by</span>
              </div>

              {/* Status Filters */}
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`whitespace-nowrap rounded-xl px-4 py-2 font-sans text-xs font-semibold transition-all ${
                  statusFilter === "all"
                    ? "bg-amber-primary text-slate-950 shadow-md shadow-amber-primary/20"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                All Tours
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("published")}
                className={`whitespace-nowrap rounded-xl px-4 py-2 font-sans text-xs font-semibold transition-all ${
                  statusFilter === "published"
                    ? "bg-success text-white shadow-md shadow-success/20"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Published
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={`whitespace-nowrap rounded-xl px-4 py-2 font-sans text-xs font-semibold transition-all ${
                  statusFilter === "draft"
                    ? "bg-warning text-white shadow-md shadow-warning/20"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                  Drafts
                </span>
              </button>

              {/* ✅ Company Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="appearance-none whitespace-nowrap rounded-xl px-4 py-2 pr-8 font-sans text-xs font-semibold transition-all bg-bg-secondary text-text-secondary hover:bg-bg-tertiary outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-amber-primary/20 cursor-pointer"
                >
                  <option value="">All Companies</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
              </div>

              {/* Clear all filters button */}
              {(search || statusFilter !== "all" || selectedCompanyId) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setSelectedCompanyId("");
                  }}
                  className="whitespace-nowrap rounded-xl px-3 py-2 font-sans text-xs font-medium text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all"
                >
                  <X className="h-3.5 w-3.5 inline mr-1" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LOADING */}
        {isLoadingTours && (
          <div className="mt-12 flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-border-subtle border-t-amber-primary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-text-muted" />
                </div>
              </div>
              <p className="subheading text-sm">Loading tours...</p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {!isLoadingTours && isToursError && (
          <div className="mt-8 rounded-2xl border border-error/20 bg-error/5 p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-error/10 p-3">
                <FileText className="h-6 w-6 text-error" />
              </div>
              <p className="font-sans text-sm font-semibold text-error">
                Unable to load tours
              </p>
              <p className="subheading text-xs text-text-muted">
                Please try again in a moment
              </p>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoadingTours && !isToursError && tours.length === 0 && (
          <div className="mt-8 flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border-subtle bg-bg-card/50 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-tertiary">
              <FileText className="h-6 w-6 text-text-muted" />
            </div>

            <h3 className="mt-6 font-serif text-lg font-bold text-text-primary">
              {search || statusFilter !== "all" || selectedCompanyId
                ? "No tours found"
                : "No tours yet"}
            </h3>

            <p className="subheading mt-2 max-w-sm text-sm">
              {search || statusFilter !== "all" || selectedCompanyId
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first tour. It's quick and easy!"}
            </p>

            {!search && statusFilter === "all" && !selectedCompanyId && (
              <button
                type="button"
                onClick={handleCreateTour}
                className="btn-yellow mt-6"
              >
                <Plus className="h-4 w-4" />
                Create Your First Tour
              </button>
            )}
          </div>
        )}

        {/* TOURS DISPLAY - Same as before */}
        {!isLoadingTours && !isToursError && tours.length > 0 && (
          <>
            {/* Results info */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="subheading text-sm text-text-secondary">
                Showing{" "}
                <span className="font-semibold text-text-primary">{startIndex}</span>{" "}
                to{" "}
                <span className="font-semibold text-text-primary">{endIndex}</span>{" "}
                of{" "}
                <span className="font-semibold text-text-primary">{totalItems}</span>{" "}
                tours
              </p>

              <div className="flex items-center gap-3">
                <label className="subheading text-sm text-text-secondary">
                  Show:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="rounded-xl border-0 bg-bg-secondary px-3 py-2 font-sans text-sm text-text-primary outline-none ring-1 ring-border-subtle transition-all focus:ring-2 focus:ring-amber-primary/20"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>

            {/* PUBLISHED TOURS */}
            {publishedTours.length > 0 && (
              <section className="mt-6">
                <div className="mb-6 flex items-end justify-between border-b border-border-subtle pb-4">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-text-primary">
                      Published Tours
                    </h2>
                    <p className="subheading text-xs text-text-muted">
                      Tours currently available to travelers
                    </p>
                  </div>
                  <span className="badge-yellow">
                    {publishedTours.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {publishedTours.map((tour) => (
                    <TourCard
                      key={tour._id}
                      tour={tour}
                      userRole={userRole}
                      onView={handleViewTour}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* DRAFT TOURS */}
            {draftTours.length > 0 && (
              <section className="mt-12">
                <div className="mb-6 flex items-end justify-between border-b border-border-subtle pb-4">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-text-primary">
                      Draft Tours
                    </h2>
                    <p className="subheading text-xs text-text-muted">
                      Continue editing or publish when ready
                    </p>
                  </div>
                  <span className="badge-yellow">
                    {draftTours.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {draftTours.map((tour) => (
                    <TourCard
                      key={tour._id}
                      tour={tour}
                      userRole={userRole}
                      onView={handleViewTour}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl bg-bg-card/50 px-6 py-4 ring-1 ring-border-subtle backdrop-blur-sm sm:flex-row">
                <div className="subheading order-2 text-sm text-text-secondary sm:order-1">
                  Page{" "}
                  <span className="font-semibold text-text-primary">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text-primary">
                    {totalPages}
                  </span>
                </div>

                <div className="order-1 flex items-center gap-1 sm:order-2">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-xl border-0 px-4 py-2 font-sans text-sm font-medium text-text-secondary transition-all hover:bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 font-sans text-sm font-medium transition-all ${
                        page === currentPage
                          ? "bg-amber-primary text-slate-950 shadow-md shadow-amber-primary/20"
                          : "text-text-secondary hover:bg-bg-tertiary"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-xl border-0 px-4 py-2 font-sans text-sm font-medium text-text-secondary transition-all hover:bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS - Same as before */}
      {/* DELETE MODAL */}
      {deleteTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-bg-card p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
                <Trash2 className="h-6 w-6 text-error" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-text-primary">
                Delete this tour?
              </h3>
              <p className="subheading mt-2 text-sm text-text-secondary">
                You're about to delete{" "}
                <span className="font-semibold text-text-primary">
                  {deleteTour.title || "this tour"}
                </span>
                . This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTour(null)}
                disabled={deleteMutation.isPending}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-error px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-lg shadow-error/20 transition-all hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH MODAL */}
      {publishTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-bg-card p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-primary/10">
                <Sparkles className="h-6 w-6 text-amber-primary" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-text-primary">
                Publish this tour?
              </h3>
              <p className="subheading mt-2 text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">
                  {publishTour.title || "This tour"}
                </span>
                will become available to travelers immediately.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPublishTour(null)}
                disabled={publishMutation.isPending}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPublish}
                disabled={publishMutation.isPending}
                className="btn-yellow"
              >
                {publishMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT TOUR */}
      <CreateTour
        isOpen={isCreateTourOpen}
        onClose={() => {
          setIsCreateTourOpen(false);
          setEditTour(null);
        }}
        onSuccess={handleTourSuccess}
        editTour={editTour}
      />

      {/* TOUR DETAILS */}
      <TourDetails
        isOpen={isViewOpen}
        tourId={selectedTour?._id}
        onClose={handleCloseView}
      />
    </div>
  );
};

export default Tours;