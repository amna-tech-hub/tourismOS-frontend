import React, { useState } from "react";
import {
  useUserStats,
  useRoles,
  useUpdateUserRole,
  useToggleEmailVerification,
  useSoftDeleteUser,
  useRestoreUser,
  useSuperAdminUsers,
} from "../../api/queries/useSuperAdmin";
import {
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaTrash,
  FaRedo,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGenderless,
  FaBuilding,
  FaUser,
} from "react-icons/fa";

export default function UserManagement() {
  // --------------------------------------------------
  // State Management
  // --------------------------------------------------
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [page, setPage] = useState(1);

  // Modal & Selection States
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [roleChangeUser, setRoleChangeUser] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState("");

  // --------------------------------------------------
  // API Query Hooks
  // --------------------------------------------------
  const queryParams = {
    page,
    limit: 10,
    ...(search && { search }),
    ...(roleFilter && { role: roleFilter }),
    ...(verificationFilter && { emailVerified: verificationFilter }),
    includeDeleted,
  };

  const { data: usersData, isLoading, isError } = useSuperAdminUsers(queryParams);
  const { data: rolesData } = useRoles();
  const { data: userStatsData, isLoading: isStatsLoading } = useUserStats(selectedUserId);

  // Mutation Hooks
  const updateRoleMutation = useUpdateUserRole();
  const toggleVerifyMutation = useToggleEmailVerification();
  const deleteUserMutation = useSoftDeleteUser();
  const restoreUserMutation = useRestoreUser();

  const users = usersData?.data || [];
  const meta = usersData?.meta || { page: 1, totalPages: 1, totalDocuments: 0 };
  const roles = rolesData?.data || [];
  const userStats = userStatsData?.data;

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  const handleRoleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!roleChangeUser || !selectedNewRole) return;

    updateRoleMutation.mutate(
      { id: roleChangeUser._id, roleId: selectedNewRole },
      {
        onSuccess: () => {
          setRoleChangeUser(null);
          setSelectedNewRole("");
        },
      }
    );
  };

  const handleToggleVerification = (user) => {
    const action = user.emailVerified ? "unverify" : "verify";
    if (window.confirm(`Are you sure you want to ${action} email for ${user.name}?`)) {
      toggleVerifyMutation.mutate({
        id: user._id,
        emailVerified: !user.emailVerified,
      });
    }
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to soft-delete ${user.name}?`)) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const handleRestore = (user) => {
    restoreUserMutation.mutate(user._id);
  };

  // --------------------------------------------------
  // Badge Helpers
  // --------------------------------------------------
  const getRoleBadge = (role) => {
    const roleName = role?.name?.toLowerCase() || "user";
    const displayName = role?.displayName || roleName;

    const styles = {
      super_admin: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      company_admin: "bg-purple-50 text-purple-700 border-purple-200/60",
      employee: "bg-blue-50 text-blue-700 border-blue-200/60",
      user: "bg-slate-100 text-slate-700 border-slate-200/60",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
          styles[roleName] || styles.user
        }`}
      >
        {displayName}
      </span>
    );
  };

  const getVerificationBadge = (verified) => {
    return verified ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-semibold">
        <FaCheckCircle className="text-[10px]" /> Verified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-yellow-50 text-yellow-700 border border-yellow-200/60 text-[11px] font-semibold">
        <FaExclamationCircle className="text-[10px]" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage platform user accounts, assign authorization roles, and audit account status.
          </p>
        </div>
      </div>

      {/* --------------------------------------------------
          Search & Filters Bar
      -------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white text-slate-700 cursor-pointer font-medium"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r._id} value={r.name}>
                {r.displayName || r.name}
              </option>
            ))}
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => {
              setVerificationFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white text-slate-700 cursor-pointer font-medium"
          >
            <option value="">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none px-1">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => {
                setIncludeDeleted(e.target.checked);
                setPage(1);
              }}
              className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-500/20 cursor-pointer"
            />
            Show Deleted
          </label>
        </div>
      </div>

      {/* --------------------------------------------------
          Users Table
      -------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Phone</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Joined</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs">Loading user accounts...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-rose-500">
                    <FaExclamationCircle className="mx-auto mb-2 text-base" />
                    <p className="text-xs">Failed to load user directory.</p>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => {
                  const isDeleted = user.isDeleted;

                  return (
                    <tr
                      key={user._id}
                      className={`${isDeleted ? "bg-rose-50/20 opacity-75" : ""}`}
                    >
                      {/* User Info - No Avatar */}
                      <td className="py-3.5 px-5">
                        <div>
                          <div className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                            {user.name}
                            {isDeleted && (
                              <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">
                                Deleted
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-5">{getRoleBadge(user.role)}</td>

                      {/* Phone */}
                      <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                        {user.phone || "—"}
                      </td>

                      {/* Verification */}
                      <td className="py-3.5 px-5">{getVerificationBadge(user.emailVerified)}</td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-5 text-slate-400 whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View Details"
                            onClick={() => setSelectedUserId(user._id)}
                            className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                          >
                            <FaEye className="text-[10px]" />
                          </button>

                          {!isDeleted ? (
                            <>
                              <button
                                type="button"
                                title={user.emailVerified ? "Mark Unverified" : "Mark Verified"}
                                onClick={() => handleToggleVerification(user)}
                                disabled={toggleVerifyMutation.isPending}
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 cursor-pointer disabled:opacity-50"
                              >
                                <FaCheckCircle className="text-[10px]" />
                              </button>

                              <button
                                type="button"
                                title="Change Role"
                                onClick={() => {
                                  setRoleChangeUser(user);
                                  setSelectedNewRole(user.role?._id || "");
                                }}
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                              >
                                <FaUserShield className="text-[10px]" />
                              </button>

                              <button
                                type="button"
                                title="Delete User"
                                onClick={() => handleDelete(user)}
                                disabled={deleteUserMutation.isPending}
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                              >
                                <FaTrash className="text-[10px]" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              title="Restore User"
                              onClick={() => handleRestore(user)}
                              disabled={restoreUserMutation.isPending}
                              className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-yellow-200 text-yellow-600 hover:bg-yellow-50 cursor-pointer disabled:opacity-50"
                            >
                              <FaRedo className="text-[10px]" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <p className="text-xs font-medium text-slate-500">No matching user accounts found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try updating search keywords or filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Page {meta.page} of {meta.totalPages || 1} ({meta.totalDocuments || 0} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent font-medium cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={page >= (meta.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          USER DETAILS & STATS MODAL
      ================================================== */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Header - No Avatar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {userStats?.user?.name || "User Account"}
                  </h3>
                  {getRoleBadge(userStats?.user?.role)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{userStats?.user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserId(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            {isStatsLoading ? (
              <div className="py-10 text-center text-slate-400">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs">Fetching account details...</p>
              </div>
            ) : userStats ? (
              <>
                {/* Role-Aware Metrics */}
                {userStats.metrics?.roleType === "traveler" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Bookings
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {userStats.metrics.totalBookings}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Confirmed
                      </span>
                      <span className="text-base font-bold text-emerald-600">
                        {userStats.metrics.confirmedBookings}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Completed
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {userStats.metrics.completedBookings}
                      </span>
                    </div>
                    <div className="bg-yellow-50/50 border border-yellow-100 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-yellow-700 uppercase block mb-0.5">
                        Total Spent
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        PKR {userStats.metrics.totalSpent?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {userStats.metrics?.roleType === "company_admin" && (
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                        <FaBuilding className="text-yellow-500 text-xs" /> Company
                      </span>
                      <span className="font-bold text-slate-900">
                        {userStats.metrics.companyName || "Unassigned"}
                      </span>
                    </div>
                    {userStats.metrics.hasCompany && (
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Tours</span>
                          <span className="font-bold text-slate-800">
                            {userStats.metrics.totalTours}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Bookings</span>
                          <span className="font-bold text-slate-800">
                            {userStats.metrics.totalBookings}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Revenue</span>
                          <span className="font-bold text-emerald-600">
                            PKR {userStats.metrics.totalRevenue?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Details */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Account Profile
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaEnvelope className="text-slate-400 text-xs" />
                      <span className="font-medium text-slate-700">Verification:</span>
                      {getVerificationBadge(userStats.user.emailVerified)}
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <FaPhone className="text-slate-400 text-xs" />
                      <span className="font-medium text-slate-700">Phone:</span>
                      <span className="text-slate-900 font-medium">{userStats.user.phone || "—"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <FaGenderless className="text-slate-400 text-xs" />
                      <span className="font-medium text-slate-700">Gender:</span>
                      <span className="capitalize text-slate-900 font-medium">
                        {userStats.user.gender || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <FaCalendarAlt className="text-slate-400 text-xs" />
                      <span className="font-medium text-slate-700">Joined:</span>
                      <span className="text-slate-900 font-medium">
                        {userStats.user.createdAt
                          ? new Date(userStats.user.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUserId(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          UPDATE ROLE MODAL
      ================================================== */}
      {roleChangeUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Change Role</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Update permissions for {roleChangeUser.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRoleChangeUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleRoleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1.5 text-slate-700">Select New Role</label>
                <select
                  value={selectedNewRole}
                  onChange={(e) => setSelectedNewRole(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white text-slate-800 cursor-pointer"
                >
                  <option value="" disabled>
                    Choose a role
                  </option>
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.displayName || r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleChangeUser(null)}
                  className="px-3.5 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateRoleMutation.isPending}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {updateRoleMutation.isPending ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}