import React, { useState } from "react";
import {
  useSuperAdminCompanies,
  useCreateCompany,
  useSuspendCompany,
  useActivateCompany,
  useDeleteCompany,
  useCompanyStats,
} from "../../api/queries/useSuperAdmin";

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
} from "react-icons/fa";

export default function Company() {
  // Search & Filter Parameters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [page, setPage] = useState(1);

  // Modal States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // Invite Form State
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Query Parameters
  const queryParams = {
    page,
    limit: 10,
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
    ...(verificationFilter && {
      verificationStatus: verificationFilter,
    }),
  };

  // React Query Hooks
  const {
    data: companyData,
    isLoading,
    isError,
  } = useSuperAdminCompanies(queryParams);

  const {
    data: companyStatsData,
    isLoading: isStatsLoading,
  } = useCompanyStats(selectedCompanyId);

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

  // --------------------------------------------------
  // Invite Company
  // --------------------------------------------------

  const handleInviteSubmit = (e) => {
    e.preventDefault();

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
  // Status Badge
  // --------------------------------------------------

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
            <FaCheckCircle className="text-[9px]" />
            Active
          </span>
        );

      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold">
            <FaBan className="text-[9px]" />
            Suspended
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
            <FaExclamationCircle className="text-[9px]" />
            Inactive
          </span>
        );
    }
  };

  // --------------------------------------------------
  // Verification Badge
  // --------------------------------------------------

  const getVerificationBadge = (status = "pending") => {
    const styles = {
      verified:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
      pending:
        "bg-amber-50 text-amber-700 border-amber-100",
      rejected:
        "bg-red-50 text-red-700 border-red-100",
    };

    const icons = {
      verified: <FaCheckCircle className="text-[9px]" />,
      pending: <FaExclamationCircle className="text-[9px]" />,
      rejected: <FaBan className="text-[9px]" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold capitalize ${
          styles[status] || styles.pending
        }`}
      >
        {icons[status] || icons.pending}
        {status}
      </span>
    );
  };

  // --------------------------------------------------
  // AI Plan Badge
  // --------------------------------------------------

  const getPlanBadge = (plan = "Starter") => {
    const badgeColors = {
      Starter:
        "bg-slate-100 text-slate-700 border-slate-200",
      Pro:
        "bg-amber-100 text-amber-900 border-amber-200",
      Enterprise:
        "bg-indigo-100 text-indigo-900 border-indigo-200",
    };

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
          badgeColors[plan] || badgeColors.Starter
        }`}
      >
        {plan}
      </span>
    );
  };

  // --------------------------------------------------
  // Company Actions
  // --------------------------------------------------

  const handleSuspend = (company) => {
    if (
      window.confirm(
        `Are you sure you want to suspend ${company.companyName}?`
      )
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
        `Delete ${company.companyName}? This action cannot be easily undone.`
      )
    ) {
      deleteCompanyMutation.mutate(company._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Companies
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage and monitor registered tourism companies across TourismOS.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="btn-yellow text-xs py-2.5 px-4 gap-2 self-start sm:self-auto cursor-pointer inline-flex items-center"
        >
          <FaPlus />
          Invite Company
        </button>
      </div>

      {/* --------------------------------------------------
          Search & Filters
      -------------------------------------------------- */}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}

        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3 text-xs text-slate-400" />

          <input
            type="text"
            placeholder="Search company, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-slate-50/50"
          />
        </div>

        {/* Filters */}

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white text-slate-700 cursor-pointer"
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
            className="w-full sm:w-auto px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white text-slate-700 cursor-pointer"
          >
            <option value="">All Verifications</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* --------------------------------------------------
          Companies Table
      -------------------------------------------------- */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Company</th>

                <th className="py-3.5 px-5">
                  Status
                </th>

                <th className="py-3.5 px-5">
                  Verification
                </th>

                <th className="py-3.5 px-5">
                  AI Plan
                </th>

                <th className="py-3.5 px-5">
                  AI Credits
                </th>

                <th className="py-3.5 px-5">
                  Registered
                </th>

                <th className="py-3.5 px-5 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Loading */}

              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-14 text-center text-slate-400"
                  >
                    <div className="w-7 h-7 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />

                    <p className="text-xs">
                      Loading companies directory...
                    </p>
                  </td>
                </tr>
              ) : isError ? (
                /* Error */

                <tr>
                  <td
                    colSpan="7"
                    className="py-14 text-center text-red-500"
                  >
                    <FaExclamationCircle className="mx-auto mb-2 text-lg" />

                    <p className="text-xs">
                      Failed to fetch companies.
                    </p>

                    <p className="text-[10px] text-red-400 mt-1">
                      Please try again.
                    </p>
                  </td>
                </tr>
              ) : companies.length > 0 ? (
                /* Companies */

                companies.map((company) => {
                  const totalCredits =
                    company.aiCredits?.total || 500;

                  const usedCredits =
                    company.aiCredits?.used || 0;

                  const remainingCredits = Math.max(
                    0,
                    totalCredits - usedCredits
                  );

                  return (
                    <tr
                      key={company._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Company */}

                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900 text-sm">
                          {company.companyName}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {company.email}
                        </div>
                      </td>

                      {/* Status */}

                      <td className="py-4 px-5">
                        {getStatusBadge(company.status)}
                      </td>

                      {/* Verification */}

                      <td className="py-4 px-5">
                        {getVerificationBadge(
                          company.verificationStatus
                        )}
                      </td>

                      {/* AI Plan */}

                      <td className="py-4 px-5">
                        {getPlanBadge(
                          company.aiCredits?.plan
                        )}
                      </td>

                      {/* AI Credits */}

                      <td className="py-4 px-5">
                        <div className="min-w-[100px]">
                          <div className="flex items-baseline gap-1">
                            <span className="font-semibold text-slate-800">
                              {remainingCredits.toLocaleString()}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              / {totalCredits.toLocaleString()}
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (remainingCredits /
                                    totalCredits) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Registered */}

                      <td className="py-4 px-5 text-slate-400 whitespace-nowrap">
                        {company.createdAt
                          ? new Date(
                              company.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Actions */}

                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}

                          <button
                            type="button"
                            title="View company details"
                            onClick={() =>
                              setSelectedCompanyId(
                                company._id
                              )
                            }
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <FaEye className="text-[11px]" />
                          </button>

                          {/* Suspend */}

                          {company.status === "active" && (
                            <button
                              type="button"
                              title="Suspend company"
                              onClick={() =>
                                handleSuspend(company)
                              }
                              disabled={
                                suspendCompanyMutation.isPending
                              }
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <FaBan className="text-[11px]" />
                            </button>
                          )}

                          {/* Activate */}

                          {company.status !== "active" && (
                            <button
                              type="button"
                              title="Activate company"
                              onClick={() =>
                                handleActivate(company)
                              }
                              disabled={
                                activateCompanyMutation.isPending
                              }
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <FaCheck className="text-[11px]" />
                            </button>
                          )}

                          {/* Delete */}

                          <button
                            type="button"
                            title="Delete company"
                            onClick={() =>
                              handleDelete(company)
                            }
                            disabled={
                              deleteCompanyMutation.isPending
                            }
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
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
                  <td
                    colSpan="7"
                    className="py-14 text-center text-slate-400"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                      <FaSearch className="text-slate-300" />
                    </div>

                    <p className="text-xs font-medium text-slate-500">
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

        {/* --------------------------------------------------
            Pagination
        -------------------------------------------------- */}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 text-xs">
          <span className="text-slate-400">
            Page {meta.page} of {meta.totalPages || 1}{" "}
            ({meta.totalDocuments || 0} companies)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              className="btn-outline py-1.5 px-3 text-xs disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            <button
              disabled={
                page >= (meta.totalPages || 1)
              }
              onClick={() => setPage((p) => p + 1)}
              className="btn-outline py-1.5 px-3 text-xs disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          INVITE COMPANY MODAL
      ================================================== */}

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-100">
            {/* Header */}

            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Invite Tourism Company
                </h3>

                <p className="text-[11px] text-slate-400 mt-1">
                  An invitation will be sent to the company email.
                </p>
              </div>

              <button
                onClick={() =>
                  setIsInviteModalOpen(false)
                }
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
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
                <label className="block font-semibold mb-1 text-slate-700">
                  Company Name
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Email */}

              <div>
                <label className="block font-semibold mb-1 text-slate-700">
                  Company Email
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="block font-semibold mb-1 text-slate-700">
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Address */}

              <div>
                <label className="block font-semibold mb-1 text-slate-700">
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Buttons */}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setIsInviteModalOpen(false)
                  }
                  className="btn-outline py-2 px-4 text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createCompanyMutation.isPending
                  }
                  className="btn-yellow py-2 px-4 text-xs cursor-pointer"
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

      {/* ==================================================
          COMPANY DETAILS MODAL
      ================================================== */}

      {selectedCompanyId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}

            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    {companyStats?.companyName ||
                      "Company Details"}
                  </h3>

                  {getStatusBadge(
                    companyStats?.status || "active"
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  {companyStats?.email}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedCompanyId(null)
                }
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Loading */}

            {isStatsLoading ? (
              <div className="py-12 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />

                Fetching company details...
              </div>
            ) : (
              <>
                {/* Stats */}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Employees */}

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                      Employees
                    </span>

                    <span className="text-xl font-bold text-slate-900">
                      {companyStats?.stats
                        ?.totalEmployees || 0}
                    </span>
                  </div>

                  {/* Tours */}

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                      Tours
                    </span>

                    <span className="text-xl font-bold text-slate-900">
                      {companyStats?.stats?.totalTours ||
                        0}
                    </span>
                  </div>

                  {/* Bookings */}

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                      Bookings
                    </span>

                    <span className="text-xl font-bold text-slate-900">
                      {companyStats?.stats
                        ?.totalBookings || 0}
                    </span>
                  </div>

                  {/* Revenue */}

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <span className="text-[10px] font-semibold text-amber-700 uppercase block mb-1">
                      Revenue
                    </span>

                    <span className="text-xl font-bold text-slate-900">
                      PKR{" "}
                      {(
                        companyStats?.stats?.revenue ||
                        0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* AI Credits */}

                {(() => {
                  const aiCredits =
                    companyStats?.stats?.aiCredits;

                  const total =
                    aiCredits?.total || 500;

                  const used =
                    aiCredits?.used || 0;

                  const remaining =
                    aiCredits?.remaining ??
                    Math.max(0, total - used);

                  const percentage =
                    total > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (remaining / total) * 100
                          )
                        )
                      : 0;

                  return (
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs">
                        <span className="font-semibold text-slate-700">
                          AI Credits ·{" "}
                          {aiCredits?.plan ||
                            "Starter"}{" "}
                          Plan
                        </span>

                        <span className="font-bold text-amber-600">
                          {remaining.toLocaleString()}{" "}
                          / {total.toLocaleString()}{" "}
                          remaining
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>
                          Used:{" "}
                          {used.toLocaleString()}
                        </span>

                        <span>
                          Expires:{" "}
                          {aiCredits?.expiresAt
                            ? new Date(
                                aiCredits.expiresAt
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Company Details */}

                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h4 className="font-serif font-bold text-slate-900 text-sm">
                    Company Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">
                        Phone
                      </span>

                      <span className="text-slate-500">
                        {companyStats?.phone || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">
                        Address
                      </span>

                      <span className="text-slate-500">
                        {companyStats?.address || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">
                        Verification
                      </span>

                      {getVerificationBadge(
                        companyStats?.verificationStatus ||
                          "pending"
                      )}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">
                        AI Plan
                      </span>

                      {getPlanBadge(
                        companyStats?.stats?.aiCredits
                          ?.plan
                      )}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">
                        Registered
                      </span>

                      <span className="text-slate-500">
                        {companyStats?.createdAt
                          ? new Date(
                              companyStats.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Footer */}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() =>
                  setSelectedCompanyId(null)
                }
                className="btn-outline py-2 px-5 text-xs cursor-pointer"
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

