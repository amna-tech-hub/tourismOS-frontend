import React, { useState } from "react";
import {
  useUserStats,
  useRoles,
  useUpdateUserRole,
  useToggleEmailVerification,
  useSoftDeleteUser,
  useRestoreUser,
  useSuperAdminUsers
} from "../../api/queries/useSuperAdmin"; // Adjust path as needed
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
  FaTicketAlt,
  FaWallet,
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
  const [roleChangeUser, setRoleChangeUser] = useState(null); // User object for role edit modal
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
  // Badges UI Helpers
  // --------------------------------------------------
  const getRoleBadge = (role) => {
    const roleName = role?.name?.toLowerCase() || "user";
    const displayName = role?.displayName || roleName;

    const styles = {
      super_admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
      company_admin: "bg-purple-50 text-purple-700 border-purple-200",
      employee: "bg-blue-50 text-blue-700 border-blue-200",
      user: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
          styles[roleName] || styles.user
        }`}
      >
        {displayName}
      </span>
    );
  };

  const getVerificationBadge = (verified) => {
    return verified ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
        <FaCheckCircle className="text-[9px]" /> Verified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold">
        <FaExclamationCircle className="text-[9px]" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">Users Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage user accounts, assigned roles, and email verification across the platform.
          </p>
        </div>
      </div>

      {/* --------------------------------------------------
          Search & Filters
      -------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3 text-xs text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          {/* Dynamic Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white text-slate-700 cursor-pointer"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r._id} value={r.name}>
                {r.displayName || r.name}
              </option>
            ))}
          </select>

          {/* Email Verification Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => {
              setVerificationFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white text-slate-700 cursor-pointer"
          >
            <option value="">All Verifications</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          {/* Include Soft-Deleted Checkbox */}
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer px-2 py-2">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => {
                setIncludeDeleted(e.target.checked);
                setPage(1);
              }}
              className="rounded text-amber-500 focus:ring-amber-500"
            />
            Show Deleted
          </label>
        </div>
      </div>

      {/* --------------------------------------------------
          Users Table
      -------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Phone</th>
                <th className="py-3.5 px-5">Verification</th>
                <th className="py-3.5 px-5">Joined</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-14 text-center text-slate-400">
                    <div className="w-7 h-7 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs">Loading users directory...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="6" className="py-14 text-center text-red-500">
                    <FaExclamationCircle className="mx-auto mb-2 text-lg" />
                    <p className="text-xs">Failed to fetch users list.</p>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => {
                  const isDeleted = user.isDeleted;

                  return (
                    <tr
                      key={user._id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isDeleted ? "bg-red-50/30 opacity-75" : ""
                      }`}
                    >
                      {/* User Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                            {user.profilePicture?.url ? (
                              <img
                                src={user.profilePicture.url}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.name?.charAt(0)?.toUpperCase() || "U"
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                              {user.name}
                              {isDeleted && (
                                <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                  Deleted
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-5">{getRoleBadge(user.role)}</td>

                      {/* Phone */}
                      <td className="py-4 px-5 text-slate-500 whitespace-nowrap">
                        {user.phone || "N/A"}
                      </td>

                      {/* Verification Status */}
                      <td className="py-4 px-5">{getVerificationBadge(user.emailVerified)}</td>

                      {/* Joined Date */}
                      <td className="py-4 px-5 text-slate-400 whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            title="View user details & stats"
                            onClick={() => setSelectedUserId(user._id)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <FaEye className="text-[11px]" />
                          </button>

                          {!isDeleted ? (
                            <>
                              {/* Toggle Verification */}
                              <button
                                type="button"
                                title={user.emailVerified ? "Mark Unverified" : "Mark Verified"}
                                onClick={() => handleToggleVerification(user)}
                                disabled={toggleVerifyMutation.isPending}
                                className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <FaCheckCircle className="text-[11px]" />
                              </button>

                              {/* Edit Role */}
                              <button
                                type="button"
                                title="Change Role"
                                onClick={() => {
                                  setRoleChangeUser(user);
                                  setSelectedNewRole(user.role?._id || "");
                                }}
                                className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              >
                                <FaUserShield className="text-[11px]" />
                              </button>

                              {/* Soft Delete */}
                              <button
                                type="button"
                                title="Soft Delete User"
                                onClick={() => handleDelete(user)}
                                disabled={deleteUserMutation.isPending}
                                className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <FaTrash className="text-[11px]" />
                              </button>
                            </>
                          ) : (
                            /* Restore */
                            <button
                              type="button"
                              title="Restore User Account"
                              onClick={() => handleRestore(user)}
                              disabled={restoreUserMutation.isPending}
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <FaRedo className="text-[11px]" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-14 text-center text-slate-400">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                      <FaSearch className="text-slate-300" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">No users found</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Try adjusting your search query or role filter.
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
            Page {meta.page} of {meta.totalPages || 1} ({meta.totalDocuments || 0} users)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="btn-outline py-1.5 px-3 text-xs disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={page >= (meta.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="btn-outline py-1.5 px-3 text-xs disabled:opacity-40 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-base overflow-hidden">
                  {userStats?.user?.profilePicture ? (
                    <img
                      src={userStats.user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userStats?.user?.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-bold text-slate-900">
                      {userStats?.user?.name || "User Details"}
                    </h3>
                    {getRoleBadge(userStats?.user?.role)}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{userStats?.user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            {isStatsLoading ? (
              <div className="py-12 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
                Fetching user analytics...
              </div>
            ) : userStats ? (
              <>
                {/* Metrics Grid (Role-Aware) */}
                {userStats.metrics?.roleType === "traveler" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                        Total Bookings
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {userStats.metrics.totalBookings}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                        Confirmed
                      </span>
                      <span className="text-xl font-bold text-emerald-600">
                        {userStats.metrics.confirmedBookings}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                        Completed
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {userStats.metrics.completedBookings}
                      </span>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                      <span className="text-[10px] font-semibold text-amber-700 uppercase block mb-1">
                        Total Spent
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        PKR {userStats.metrics.totalSpent.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {userStats.metrics?.roleType === "company_admin" && (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-2">
                        <FaBuilding className="text-amber-500" /> Company Affiliation
                      </span>
                      <span className="font-bold text-slate-900">
                        {userStats.metrics.companyName || "No Associated Company"}
                      </span>
                    </div>
                    {userStats.metrics.hasCompany && (
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Tours</span>
                          <span className="font-bold text-slate-800">
                            {userStats.metrics.totalTours}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Bookings</span>
                          <span className="font-bold text-slate-800">
                            {userStats.metrics.totalBookings}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Revenue</span>
                          <span className="font-bold text-emerald-600">
                            PKR {userStats.metrics.totalRevenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Information Breakdown */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="font-serif font-bold text-slate-900 text-sm">
                    Account Profile Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaEnvelope className="text-slate-400" />
                      <span className="font-medium text-slate-800">Email Verification:</span>
                      {getVerificationBadge(userStats.user.emailVerified)}
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <FaPhone className="text-slate-400" />
                      <span className="font-medium text-slate-800">Phone:</span>
                      <span>{userStats.user.phone || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <FaGenderless className="text-slate-400" />
                      <span className="font-medium text-slate-800">Gender:</span>
                      <span className="capitalize">{userStats.user.gender || "Not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <FaCalendarAlt className="text-slate-400" />
                      <span className="font-medium text-slate-800">Joined:</span>
                      <span>
                        {userStats.user.createdAt
                          ? new Date(userStats.user.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedUserId(null)}
                className="btn-outline py-2 px-5 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          UPDATE USER ROLE MODAL
      ================================================== */}
      {roleChangeUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">Change User Role</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Reassign security privileges for {roleChangeUser.name}
                </p>
              </div>
              <button
                onClick={() => setRoleChangeUser(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="" disabled>
                    Choose a role
                  </option>
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.displayName || r.name} — ({r.description || "System Role"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleChangeUser(null)}
                  className="btn-outline py-2 px-4 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateRoleMutation.isPending}
                  className="btn-yellow py-2 px-4 text-xs cursor-pointer"
                >
                  {updateRoleMutation.isPending ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}