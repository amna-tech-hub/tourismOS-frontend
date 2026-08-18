// src/pages/company-admin/Employees.jsx

import React, { useMemo, useState } from "react";

import {
  Plus,
  Search,
  Users,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building2,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Send,
  BriefcaseBusiness,
} from "lucide-react";

import {
  useCompanyEmployees,
  useInviteEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "../../api/queries/useCompanyEmployee";

// ======================================================
// HELPERS
// ======================================================

const formatNumber = (number = 0) => {
  return new Intl.NumberFormat("en-US").format(number);
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getEmployeeName = (employee) => {
  return (
    employee?.user?.name ||
    employee?.name ||
    employee?.email ||
    "Employee"
  );
};

const getEmployeeEmail = (employee) => {
  return employee?.user?.email || employee?.email || "—";
};

const getEmployeePhone = (employee) => {
  return employee?.user?.phone || employee?.phone || "—";
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() || "EM";
  }

  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
};

// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <UserCheck size={12} />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      <UserX size={12} />
      Inactive
    </span>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

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
// EMPLOYEE CARD
// ======================================================

const EmployeeCard = ({
  employee,
  onView,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const name = getEmployeeName(employee);
  const email = getEmployeeEmail(employee);
  const phone = getEmployeePhone(employee);

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* TOP */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-sm font-semibold text-amber-600">
            {employee?.user?.avatar ? (
              <img
                src={employee.user.avatar}
                alt={name}
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              getInitials(name)
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {name}
            </h3>

            <p className="mt-0.5 truncate text-xs text-slate-500">
              {employee?.designation || "Employee"}
            </p>
          </div>
        </div>

        {/* MENU */}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <MoreVertical size={17} />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              />

              <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onView(employee);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Eye size={15} />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(employee);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Edit3 size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(employee);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* STATUS */}

      <div className="mt-4">
        <StatusBadge status={employee?.status} />
      </div>

      {/* DETAILS */}

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Mail size={15} className="shrink-0 text-slate-400" />

          <span className="truncate">
            {email}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Phone size={15} className="shrink-0 text-slate-400" />

          <span className="truncate">
            {phone}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <BriefcaseBusiness
            size={15}
            className="shrink-0 text-slate-400"
          />

          <span className="truncate">
            {employee?.department || "General"}
          </span>
        </div>
      </div>

      {/* FOOTER */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Joined
          </p>

          <p className="mt-1 text-xs font-medium text-slate-600">
            {formatDate(employee?.joiningDate)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onView(employee)}
          className="text-xs font-semibold text-amber-600 transition hover:text-amber-700"
        >
          View details
        </button>
      </div>
    </div>
  );
};

// ======================================================
// INVITE EMPLOYEE MODAL
// ======================================================

const InviteEmployeeModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    email: "",
    designation: "",
    department: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");

  const inviteMutation = useInviteEmployee();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      setError("Employee email is required.");
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        email: form.email.trim(),
        designation: form.designation.trim(),
        department: form.department.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      setForm({
        email: "",
        designation: "",
        department: "",
        phone: "",
        address: "",
      });

      setError("");

      onSuccess?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to send employee invitation."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Send size={18} />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Invite Employee
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Send an invitation so the employee can create their account.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={inviteMutation.isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-6"
        >
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {/* EMAIL */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="employee@example.com"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* DESIGNATION + DEPARTMENT */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Designation
              </label>

              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Tour Manager"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Department
              </label>

              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Operations"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          {/* PHONE */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* ADDRESS */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              placeholder="Employee address"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={inviteMutation.isPending}
              className="btn-outline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={inviteMutation.isPending}
              className="btn-yellow disabled:pointer-events-none disabled:opacity-50"
            >
              {inviteMutation.isPending ? (
                <>
                  <Loader2
                    size={16}
                    className="mr-2 animate-spin"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send
                    size={16}
                    className="mr-2"
                  />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================================================
// VIEW EMPLOYEE MODAL
// ======================================================

const EmployeeDetailsModal = ({
  employee,
  onClose,
  onEdit,
}) => {
  if (!employee) return null;

  const name = getEmployeeName(employee);
  const email = getEmployeeEmail(employee);
  const phone = getEmployeePhone(employee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-sm font-semibold text-amber-600">
              {employee?.user?.avatar ? (
                <img
                  src={employee.user.avatar}
                  alt={name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                getInitials(name)
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {name}
              </h2>

              <p className="text-sm text-slate-500">
                {employee?.designation || "Employee"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="space-y-5 px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Status
            </span>

            <StatusBadge status={employee.status} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                <Mail size={14} />
                Email
              </div>

              <p className="mt-2 break-all text-sm font-medium text-slate-700">
                {email}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                <Phone size={14} />
                Phone
              </div>

              <p className="mt-2 text-sm font-medium text-slate-700">
                {phone}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                <BriefcaseBusiness size={14} />
                Department
              </div>

              <p className="mt-2 text-sm font-medium text-slate-700">
                {employee?.department || "General"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                <Building2 size={14} />
                Joining Date
              </div>

              <p className="mt-2 text-sm font-medium text-slate-700">
                {formatDate(employee?.joiningDate)}
              </p>
            </div>
          </div>

          {employee?.address && (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Address
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {employee.address}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="btn-yellow"
          >
            <Edit3
              size={16}
              className="mr-2"
            />
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// EDIT EMPLOYEE MODAL
// ======================================================

const EditEmployeeModal = ({
  employee,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    designation: employee?.designation || "",
    department: employee?.department || "",
    status: employee?.status || "active",
    joiningDate: employee?.joiningDate
      ? employee.joiningDate.slice(0, 10)
      : "",
  });

  const [error, setError] = useState("");

  const updateMutation = useUpdateEmployee();

  if (!employee) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        id: employee._id,
        ...form,
      });

      onSuccess?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update employee."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Edit Employee
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update employee information and status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-6"
        >
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {/* EMAIL READ ONLY */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="text"
              value={getEmployeeEmail(employee)}
              disabled
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500"
            />
          </div>

          {/* DESIGNATION */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Designation
            </label>

            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Tour Manager"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* DEPARTMENT */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Department
            </label>

            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Operations"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* STATUS + JOINING DATE */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Joining Date
              </label>

              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="btn-outline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-yellow disabled:pointer-events-none disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2
                    size={16}
                    className="mr-2 animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Edit3
                    size={16}
                    className="mr-2"
                  />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================================================
// DELETE MODAL
// ======================================================

const DeleteModal = ({
  employee,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!employee) return null;

  const name = getEmployeeName(employee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <Trash2 size={20} />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-900">
          Remove employee?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-slate-700">
            "{name}"
          </span>
          ? The employee will be marked as inactive and removed from your active employee list.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="btn-outline"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2
                  size={16}
                  className="mr-2 animate-spin"
                />
                Removing...
              </>
            ) : (
              <>
                <Trash2
                  size={16}
                  className="mr-2"
                />
                Remove
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

const Employees = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [deletingEmployee, setDeletingEmployee] =
    useState(null);

  // ====================================================
  // QUERY
  // ====================================================

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCompanyEmployees({
    page,
    limit,
    search,
    status:
      statusFilter === "all"
        ? undefined
        : statusFilter,
  });

  // ====================================================
  // MUTATIONS
  // ====================================================

  const deleteEmployeeMutation =
    useDeleteEmployee();

  // ====================================================
  // API DATA
  // ====================================================

  const employees = response?.data || [];
  const meta = response?.meta || {};

  // ====================================================
  // STATS
  // ====================================================

  const stats = useMemo(() => {
    const total =
      meta.totalDocuments ??
      meta.total ??
      employees.length;

    const active = employees.filter(
      (employee) =>
        employee?.status?.toLowerCase() === "active"
    ).length;

    const inactive = employees.filter(
      (employee) =>
        employee?.status?.toLowerCase() === "inactive"
    ).length;

    return {
      total,
      active,
      inactive,
    };
  }, [employees, meta.totalDocuments, meta.total]);

  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // ====================================================
  // INVITE
  // ====================================================

  const handleInviteSuccess = async () => {
    setIsInviteOpen(false);
    setPage(1);
    await refetch();
  };

  // ====================================================
  // VIEW
  // ====================================================

  const handleView = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseView = () => {
    setSelectedEmployee(null);
  };

  // ====================================================
  // EDIT
  // ====================================================

  const handleEdit = (employee) => {
    setSelectedEmployee(null);
    setEditingEmployee(employee);
  };

  const handleEditSuccess = async () => {
    setEditingEmployee(null);
    await refetch();
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = async () => {
    if (!deletingEmployee?._id) return;

    try {
      await deleteEmployeeMutation.mutateAsync(
        deletingEmployee._id
      );

      setDeletingEmployee(null);

      await refetch();
    } catch (error) {
      console.error(
        "Delete Employee Error:",
        error
      );
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={30}
            className="animate-spin text-amber-500"
          />

          <p className="text-sm text-slate-500">
            Loading your employees...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={24} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load employees
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading your company employees.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="btn-yellow mt-5"
          >
            <RefreshCw
              size={16}
              className="mr-2"
            />
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
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-amber-600">
              Company Management
            </p>

            <span className="badge-yellow">
              Employees
            </span>
          </div>

          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Employees
          </h1>

          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Invite, manage, and organize your company's team members.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="btn-yellow self-start sm:self-auto"
        >
          <Plus
            size={17}
            className="mr-2"
          />
          Invite Employee
        </button>
      </div>

      {/* ==================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Employees"
          value={formatNumber(stats.total)}
          icon={Users}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Active"
          value={formatNumber(stats.active)}
          icon={UserCheck}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Inactive"
          value={formatNumber(stats.inactive)}
          icon={UserX}
          iconClass="bg-slate-100 text-slate-600"
        />
      </div>

      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              placeholder="Search employees, departments..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* FILTER + REFRESH */}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              <Filter
                size={15}
                className="ml-2 mr-1 text-slate-400"
              />

              {[
                ["all", "All"],
                ["active", "Active"],
                ["inactive", "Inactive"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    statusFilter === value
                      ? "bg-white text-slate-900 shadow-sm"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Users size={27} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            {search || statusFilter !== "all"
              ? "No employees found"
              : "Build your team"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {search || statusFilter !== "all"
              ? "Try changing your search or filter to find what you're looking for."
              : "Invite employees to your company and start building your travel operations team."}
          </p>

          {!search &&
            statusFilter === "all" && (
              <button
                type="button"
                onClick={() =>
                  setIsInviteOpen(true)
                }
                className="btn-yellow mt-6"
              >
                <Send
                  size={16}
                  className="mr-2"
                />
                Invite Employee
              </button>
            )}
        </div>
      ) : (
        /* ==================================================
            EMPLOYEE GRID
        ================================================== */

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {employees.map((employee) => (
            <EmployeeCard
              key={
                employee._id ||
                employee.id
              }
              employee={employee}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={setDeletingEmployee}
            />
          ))}
        </div>
      )}

      {/* ==================================================
          PAGINATION
      ================================================== */}

      {employees.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {employees.length}
            </span>{" "}
            employee
            {employees.length !== 1
              ? "s"
              : ""}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={
                page <= 1 ||
                isFetching
              }
              onClick={() =>
                setPage((prev) =>
                  Math.max(1, prev - 1)
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white">
              {page}
            </span>

            <button
              type="button"
              disabled={
                isFetching ||
                (meta.totalPages
                  ? page >= meta.totalPages
                  : employees.length < limit)
              }
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          INVITE MODAL
      ================================================== */}

      <InviteEmployeeModal
        isOpen={isInviteOpen}
        onClose={() =>
          setIsInviteOpen(false)
        }
        onSuccess={handleInviteSuccess}
      />

      {/* ==================================================
          VIEW EMPLOYEE
      ================================================== */}

      <EmployeeDetailsModal
        employee={selectedEmployee}
        onClose={handleCloseView}
        onEdit={handleEdit}
      />

      {/* ==================================================
          EDIT EMPLOYEE
      ================================================== */}

      <EditEmployeeModal
        employee={editingEmployee}
        onClose={() =>
          setEditingEmployee(null)
        }
        onSuccess={handleEditSuccess}
      />

      {/* ==================================================
          DELETE MODAL
      ================================================== */}

      <DeleteModal
        employee={deletingEmployee}
        isDeleting={
          deleteEmployeeMutation.isPending
        }
        onCancel={() =>
          setDeletingEmployee(null)
        }
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Employees;