import React, { useState } from "react";
import {
  useSuperAdminCompanies,
  useCreateCompany,
  useSuspendCompany,
  useActivateCompany,
  useDeleteCompany,
  useCompanyStats,
  useTourAnalytics,
} from "../../api/queries/useSuperAdmin";

import CompanyPerformanceChart from "../../components/charts/company-chart/CompanyPerformanceChart";

import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaBan,
  FaEye,
  FaTrash,
  FaCheck,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCoins,
} from "react-icons/fa";
import AcceptInvite from "../shared/AcceptInvite";

export default function Company() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [page, setPage] = useState(1);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
  });

  const queryParams = {
    page,
    limit: 10,
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
    ...(verificationFilter && {
      verificationStatus: verificationFilter,
    }),
  };

  const {
    data: companyData,
    isLoading,
    isError,
  } = useSuperAdminCompanies(queryParams);

  const { data: companyStatsData, isLoading: isStatsLoading } =
    useCompanyStats(selectedCompanyId);

  const { data: tourAnalyticsData, isLoading: isAnalyticsLoading } =
    useTourAnalytics();

  const createCompanyMutation = useCreateCompany();
  const suspendCompanyMutation = useSuspendCompany();
  const activateCompanyMutation = useActivateCompany();
  const deleteCompanyMutation = useDeleteCompany();

  const companies = companyData?.data || [];

  const meta = companyData?.meta || {
    page: 1,
    totalPages: 1,
    totalDocuments: 0,
  };

  const companyStats = companyStatsData?.data;

  const companyPerformance =
    tourAnalyticsData?.data?.companyTourDistribution || [];

  // --------------------------------------------------
  // INVITE COMPANY
  // --------------------------------------------------

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    (companyForm, "com form");

    createCompanyMutation.mutate(companyForm, {
      onSuccess: () => {
        setIsInviteModalOpen(false);

        setCompanyForm({
          companyName: "",
          email: "",
          phone: "",
          address: "",
        });
      },
    });
  };

  // --------------------------------------------------
  // STATUS BADGES
  // --------------------------------------------------

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-slate-200 text-[10px] font-bold whitespace-nowrap">
            <FaCheckCircle className="text-[9px] shrink-0" />
            Active
          </span>
        );

      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-slate-200 text-[10px] font-bold whitespace-nowrap">
            <FaBan className="text-[9px] shrink-0" />
            Suspended
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-slate-600 border border-slate-200 text-[10px] font-bold whitespace-nowrap">
            <FaExclamationCircle className="text-[9px] shrink-0" />
            Inactive
          </span>
        );
    }
  };

  const getVerificationBadge = (status = "pending") => {
    const styles = {
      verified: "bg-emerald-50 text-emerald-700 border-slate-200",
      pending: "bg-yellow-300/30 text-yellow-800 border-slate-200",
      rejected: "bg-rose-50 text-rose-700 border-slate-200",
    };

    const icons = {
      verified: <FaCheckCircle className="text-[9px]" />,
      pending: <FaExclamationCircle className="text-[9px]" />,
      rejected: <FaBan className="text-[9px]" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold capitalize whitespace-nowrap ${
          styles[status] || styles.pending
        }`}
      >
        {icons[status] || icons.pending}
        {status}
      </span>
    );
  };

  const getPlanBadge = (plan = "Starter") => {
    const badgeColors = {
      Starter: "bg-amber-500/10 text-slate-700 border-slate-200",
      Pro: "bg-yellow-300/40 text-yellow-900 border-slate-200",
      Enterprise: "bg-amber-500/20 text-yellow-900 border-slate-200",
    };

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-semibold border whitespace-nowrap ${
          badgeColors[plan] || badgeColors.Starter
        }`}
      >
        {plan}
      </span>
    );
  };

  // --------------------------------------------------
  // COMPANY ACTIONS
  // --------------------------------------------------

  const handleSuspend = (company) => {
    if (
      window.confirm(`Are you sure you want to suspend ${company.companyName}?`)
    ) {
      suspendCompanyMutation.mutate(company._id);
    }
  };

  const handleActivate = (company) => {
    activateCompanyMutation.mutate(company._id);
  };

  const handleDelete = (company) => {
    if (
      window.confirm(
        `Delete ${company.companyName}? This action cannot be easily undone.`,
      )
    ) {
      deleteCompanyMutation.mutate(company._id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4  space-y-3 font-sans">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900">
            Companies
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage and monitor registered tourism companies across TourismOS.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 rounded-xl bg-yellow-300 text-slate-900 font-semibold text-xs py-2.5 px-4 border border-yellow-400/40 cursor-pointer"
        >
          <FaPlus className="text-[10px]" />
          Invite Company
        </button>
      </div>

      {/* =====================================================
          COMPANY PERFORMANCE CHART
      ===================================================== */}

      {isAnalyticsLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="min-h-[280px] sm:h-[390px] flex items-center justify-center">
            <div className="text-center text-slate-500">
              <div className="w-7 h-7 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin mx-auto mb-3" />

              <p className="text-xs">Loading company performance...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <CompanyPerformanceChart data={companyPerformance} />
        </div>
      )}

      {/* =====================================================
          SEARCH & FILTERS
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          {/* Search */}

          <div className="relative w-full lg:max-w-sm">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none" />

            <input
              type="text"
              placeholder="Search company, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
            />
          </div>

          {/* Filters */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full lg:w-auto min-w-0 lg:min-w-[145px] px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value);
                setPage(1);
              }}
              className="w-full lg:w-auto min-w-0 lg:min-w-[160px] px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 cursor-pointer"
            >
              <option value="">All Verifications</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================
          COMPANIES TABLE
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[950px] text-left text-xs">
            <thead className="bg-amber-500/5 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  Company
                </th>

                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  Status
                </th>

                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  Verification
                </th>

                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  AI Plan
                </th>

                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  AI Credits
                </th>

                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  Registered
                </th>

                <th className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Loading */}

              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-14 text-center text-slate-500">
                    <div className="w-7 h-7 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin mx-auto mb-3" />

                    <p className="text-xs">Loading companies directory...</p>
                  </td>
                </tr>
              ) : isError ? (
                /* Error */

                <tr>
                  <td colSpan="7" className="py-14 text-center text-rose-500">
                    <FaExclamationCircle className="mx-auto mb-2 text-lg" />

                    <p className="text-xs">Failed to fetch companies.</p>
                  </td>
                </tr>
              ) : companies.length > 0 ? (
                /* Companies */

                companies.map((company) => {
                  const totalCredits = company.aiCredits?.total || 500;

                  const usedCredits = company.aiCredits?.used || 0;

                  const remainingCredits = Math.max(
                    0,
                    totalCredits - usedCredits,
                  );

                  const creditPercentage =
                    totalCredits > 0
                      ? Math.min(100, (remainingCredits / totalCredits) * 100)
                      : 0;

                  return (
                    <tr key={company._id}>
                      {/* Company */}

                      <td className="py-4 px-4 sm:px-5 align-middle">
                        <div className="min-w-[180px]">
                          <div className="font-semibold text-slate-900 text-sm truncate max-w-[240px]">
                            {company.companyName}
                          </div>

                          <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[240px]">
                            {company.email}
                          </div>
                        </div>
                      </td>

                      {/* Status */}

                      <td className="py-4 px-4 sm:px-5 align-middle">
                        {getStatusBadge(company.status)}
                      </td>

                      {/* Verification */}

                      <td className="py-4 px-4 sm:px-5 align-middle">
                        {getVerificationBadge(company.verificationStatus)}
                      </td>

                      {/* AI Plan */}

                      <td className="py-4 px-4 sm:px-5 align-middle">
                        {getPlanBadge(company.aiCredits?.plan)}
                      </td>

                      {/* AI Credits */}

                      <td className="py-4 px-4 sm:px-5 align-middle">
                        <div className="min-w-[120px]">
                          <div className="flex items-baseline gap-1">
                            <span className="font-semibold text-slate-900">
                              {remainingCredits.toLocaleString()}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              / {totalCredits.toLocaleString()}
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-amber-500/10 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{
                                width: `${creditPercentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Registered */}

                      <td className="py-4 px-4 sm:px-5 align-middle text-slate-500 whitespace-nowrap">
                        {company.createdAt
                          ? new Date(company.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </td>

                      {/* Actions */}

                      <td className="py-4 px-4 sm:px-5 align-middle">
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                          {/* View */}

                          <button
                            type="button"
                            title="View company details"
                            onClick={() => setSelectedCompanyId(company._id)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 cursor-pointer shrink-0"
                          >
                            <FaEye className="text-[11px]" />
                          </button>

                          {/* Suspend */}

                          {company.status === "active" && (
                            <button
                              type="button"
                              title="Suspend company"
                              onClick={() => handleSuspend(company)}
                              disabled={suspendCompanyMutation.isPending}
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-yellow-300/20 text-yellow-700 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              <FaBan className="text-[11px]" />
                            </button>
                          )}

                          {/* Activate */}

                          {company.status !== "active" && (
                            <button
                              type="button"
                              title="Activate company"
                              onClick={() => handleActivate(company)}
                              disabled={activateCompanyMutation.isPending}
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-emerald-50 text-emerald-600 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              <FaCheck className="text-[11px]" />
                            </button>
                          )}

                          {/* Delete */}

                          <button
                            type="button"
                            title="Delete company"
                            onClick={() => handleDelete(company)}
                            disabled={deleteCompanyMutation.isPending}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-rose-50 text-rose-500 cursor-pointer disabled:opacity-50 shrink-0"
                          >
                            <FaTrash className="text-[11px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Empty */

                <tr>
                  <td colSpan="7" className="py-14 text-center text-slate-500">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3 border border-slate-200">
                      <FaSearch className="text-slate-400" />
                    </div>

                    <p className="text-xs font-medium text-slate-700">
                      No companies found
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t border-slate-100 text-xs">
          <span className="text-slate-500 text-center sm:text-left">
            Page {meta.page} of {meta.totalPages || 1} (
            {meta.totalDocuments || 0} companies)
          </span>

          <div className="flex items-center justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold py-1.5 px-3 text-xs disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            <button
              disabled={page >= (meta.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold py-1.5 px-3 text-xs disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          INVITE COMPANY MODAL
      ===================================================== */}

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}

            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <div className="min-w-0">
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Invite Tourism Company
                </h3>

                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  An invitation will be sent to the company email.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 p-1 cursor-pointer shrink-0"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleInviteSubmit}
              className="space-y-4 text-xs font-sans"
            >
              {/* Company Name */}

              <div>
                <label className="block font-semibold mb-1.5 text-slate-700">
                  Company Name <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  value={companyForm.companyName}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="e.g. Karakoram Adventures"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
              </div>

              {/* Email */}

              <div>
                <label className="block font-semibold mb-1.5 text-slate-700">
                  Company Email <span className="text-rose-500">*</span>
                </label>

                <input
                  type="email"
                  required
                  value={companyForm.email}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      email: e.target.value,
                    })
                  }
                  placeholder="admin@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="block font-semibold mb-1.5 text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  value={companyForm.phone}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      phone: e.target.value,
                    })
                  }
                  placeholder="03144276663"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
              </div>

              {/* Address */}

              <div>
                <label className="block font-semibold mb-1.5 text-slate-700">
                  Address
                </label>

                <input
                  type="text"
                  value={companyForm.address}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      address: e.target.value,
                    })
                  }
                  placeholder="Rahim Yar Khan, Pakistan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
              </div>

              {/* Buttons */}

              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold py-2 px-4 text-xs cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createCompanyMutation.isPending}
                  className="rounded-xl bg-yellow-300 text-slate-900 font-semibold py-2 px-4 text-xs cursor-pointer w-full sm:w-auto disabled:opacity-50 disabled:pointer-events-none border border-yellow-400/40"
                >
                  {createCompanyMutation.isPending
                    ? "Sending..."
                    : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          COMPANY DETAILS MODAL
      ===================================================== */}

      {selectedCompanyId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}

            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 break-words">
                    {companyStats?.companyName || "Company Details"}
                  </h3>

                  {companyStats &&
                    getStatusBadge(companyStats.status || "active")}
                </div>

                <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1.5 break-all">
                  <FaEnvelope className="text-[10px] mt-0.5 shrink-0" />

                  {companyStats?.email || "N/A"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCompanyId(null)}
                className="text-slate-400 p-1 cursor-pointer shrink-0"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Loading */}

            {isStatsLoading ? (
              <div className="py-12 text-center text-slate-500">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin mx-auto mb-3" />

                <p className="text-xs">Fetching company details...</p>
              </div>
            ) : (
              <>
                {/* =================================================
                    STATS GRID
                ================================================= */}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4">
                  {/* Employees */}

                  <div className="bg-amber-500/5 border border-slate-200 p-3 rounded-xl text-center min-w-0">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase block mb-1">
                      Employees
                    </span>

                    <span className="text-lg sm:text-xl font-bold text-slate-900">
                      {companyStats?.stats?.totalEmployees || 0}
                    </span>
                  </div>

                  {/* Tours */}

                  <div className="bg-amber-500/5 border border-slate-200 p-3 rounded-xl text-center min-w-0">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase block mb-1">
                      Tours
                    </span>

                    <span className="text-lg sm:text-xl font-bold text-slate-900">
                      {companyStats?.stats?.totalTours || 0}
                    </span>
                  </div>

                  {/* Bookings */}

                  <div className="bg-amber-500/5 border border-slate-200 p-3 rounded-xl text-center min-w-0">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase block mb-1">
                      Bookings
                    </span>

                    <span className="text-lg sm:text-xl font-bold text-slate-900">
                      {companyStats?.stats?.totalBookings || 0}
                    </span>
                  </div>

                  {/* Revenue */}

                  <div className="bg-emerald-50 border border-slate-200 p-3 rounded-xl text-center min-w-0">
                    <span className="text-[9px] font-semibold text-emerald-700 uppercase block mb-1">
                      Net Revenue
                    </span>

                    <span className="text-base sm:text-xl font-bold text-slate-900 break-words">
                      PKR{" "}
                      {(
                        companyStats?.stats?.revenue?.total || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    REVENUE BREAKDOWN
                ================================================= */}

                <div className="bg-yellow-300/15 border border-slate-200 p-3 sm:p-4 rounded-xl mt-3">
                  <h4 className="text-xs font-semibold text-yellow-800 mb-3 flex items-center gap-1.5">
                    <FaCoins className="text-[10px]" />
                    Revenue Breakdown
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    {/* Gross Sales */}

                    <div className="bg-white/70 rounded-lg p-2.5 text-center border border-slate-200 min-w-0">
                      <span className="block text-slate-500 mb-0.5">
                        Gross Sales
                      </span>

                      <span className="font-bold text-slate-900 break-words">
                        PKR{" "}
                        {(
                          companyStats?.stats?.revenue?.totalBookingValue || 0
                        ).toLocaleString()}
                      </span>
                    </div>

                    {/* Commission */}

                    <div className="bg-white/70 rounded-lg p-2.5 text-center border border-slate-200 min-w-0">
                      <span className="block text-slate-500 mb-0.5">
                        Commission
                      </span>

                      <span className="font-bold text-yellow-600 break-words">
                        - PKR{" "}
                        {(
                          companyStats?.stats?.revenue?.platformCommission || 0
                        ).toLocaleString()}
                      </span>
                    </div>

                    {/* Net Earnings */}

                    <div className="bg-white/70 rounded-lg p-2.5 text-center border border-slate-200 min-w-0">
                      <span className="block text-slate-500 mb-0.5">
                        Net Earnings
                      </span>

                      <span className="font-bold text-emerald-600 break-words">
                        PKR{" "}
                        {(
                          companyStats?.stats?.revenue?.total || 0
                        ).toLocaleString()}
                      </span>
                    </div>

                    {/* Average */}

                    <div className="bg-white/70 rounded-lg p-2.5 text-center border border-slate-200 min-w-0">
                      <span className="block text-slate-500 mb-0.5">
                        Avg / Booking
                      </span>

                      <span className="font-bold text-slate-900 break-words">
                        PKR{" "}
                        {Math.round(
                          companyStats?.stats?.revenue?.averageBookingValue ||
                            0,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    AI CREDITS
                ================================================= */}

                {(() => {
                  const aiCredits = companyStats?.stats?.aiCredits;

                  const total = aiCredits?.total || 500;

                  const used = aiCredits?.used || 0;

                  const remaining =
                    aiCredits?.remaining ?? Math.max(0, total - used);

                  const percentage =
                    total > 0
                      ? Math.min(100, Math.round((remaining / total) * 100))
                      : 0;

                  return (
                    <div className="bg-amber-500/5 border border-slate-200 p-3 sm:p-4 rounded-xl space-y-2 mt-3">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:justify-between sm:items-center text-xs">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <FaCheckCircle className="text-yellow-500 text-[10px] shrink-0" />

                          <span>
                            AI Credits · {aiCredits?.plan || "Starter"} Plan
                          </span>
                        </span>

                        <span className="font-bold text-yellow-600">
                          {remaining.toLocaleString()} /{" "}
                          {total.toLocaleString()} remaining
                        </span>
                      </div>

                      <div className="w-full bg-amber-500/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between text-[10px] text-slate-500">
                        <span>Used: {used.toLocaleString()}</span>

                        <span>
                          Expires:{" "}
                          {aiCredits?.expiresAt
                            ? new Date(aiCredits.expiresAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* =================================================
                    COMPANY INFORMATION
                ================================================= */}

                <div className="border-t border-slate-100 pt-4 mt-4">
                  <h4 className="font-serif font-bold text-slate-900 text-sm mb-4 flex items-center gap-1.5">
                    <FaBuilding className="text-yellow-500 text-xs" />
                    Company Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                    {/* Phone */}

                    <div className="min-w-0">
                      <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                        <FaPhone className="text-[10px] text-slate-400" />
                        Phone
                      </span>

                      <span className="text-slate-900 break-words">
                        {companyStats?.phone || "N/A"}
                      </span>
                    </div>

                    {/* Address */}

                    <div className="min-w-0">
                      <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[10px] text-slate-400" />
                        Address
                      </span>

                      <span className="text-slate-900 break-words">
                        {companyStats?.address || "N/A"}
                      </span>
                    </div>

                    {/* Verification */}

                    <div className="min-w-0">
                      <span className="font-semibold text-slate-700 block mb-1">
                        Verification
                      </span>

                      {getVerificationBadge(
                        companyStats?.verificationStatus || "pending",
                      )}
                    </div>

                    {/* AI Plan */}

                    <div className="min-w-0">
                      <span className="font-semibold text-slate-700 block mb-1">
                        AI Plan
                      </span>

                      {getPlanBadge(companyStats?.stats?.aiCredits?.plan)}
                    </div>

                    {/* Registered */}

                    <div className="sm:col-span-2 min-w-0">
                      <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                        <FaCalendarAlt className="text-[10px] text-slate-400" />
                        Registered
                      </span>

                      <span className="text-slate-900 break-words">
                        {companyStats?.createdAt
                          ? new Date(companyStats.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* =====================================================
                MODAL FOOTER
            ===================================================== */}

            <div className="pt-4 border-t border-slate-100 flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setSelectedCompanyId(null)}
                className="rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold py-2 px-5 text-xs cursor-pointer w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
