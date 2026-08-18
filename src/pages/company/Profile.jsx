// src/pages/company-admin/Profile.jsx

import React, { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe2,
  User,
  Save,
  X,
  Edit3,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

import {
  useCompanyProfile,
  useUpdateCompanyProfile,
} from "../../api/queries/useCompany";

// ======================================================
// HELPERS
// ======================================================

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

// ======================================================
// INFO ITEM
// ======================================================

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

// ======================================================
// FORM FIELD
// ======================================================

const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  disabled = false,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60 ${
            Icon ? "pl-10" : "px-3"
          } pr-3`}
        />
      </div>
    </div>
  );
};

// ======================================================
// TEXTAREA FIELD
// ======================================================

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
      />
    </div>
  );
};

// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "").toLowerCase();

  const isActive =
    normalizedStatus === "active" ||
    normalizedStatus === "approved" ||
    normalizedStatus === "verified";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {isActive ? (
        <CheckCircle2 size={12} />
      ) : (
        <AlertCircle size={12} />
      )}

      {status || "Unknown"}
    </span>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const CompanyProfile = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
  });

  // ====================================================
  // QUERY
  // ====================================================

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCompanyProfile();

  // ====================================================
  // MUTATION
  // ====================================================

  const updateProfileMutation = useUpdateCompanyProfile();

  // ====================================================
  // API DATA
  // ====================================================

  const company = response?.data || response?.company || response || {};

  // ====================================================
  // SYNC FORM WITH API DATA
  // ====================================================

  useEffect(() => {
    if (!company || Object.keys(company).length === 0) return;

    setFormData({
      companyName: company.companyName || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      website: company.website || "",
      description: company.description || "",
    });
  }, [response]);

  // ====================================================
  // HANDLE INPUT
  // ====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================================
  // START EDIT
  // ====================================================

  const handleEdit = () => {
    setFormData({
      companyName: company.companyName || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      website: company.website || "",
      description: company.description || "",
    });

    setIsEditing(true);
  };

  // ====================================================
  // CANCEL EDIT
  // ====================================================

  const handleCancel = () => {
    setFormData({
      companyName: company.companyName || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      website: company.website || "",
      description: company.description || "",
    });

    setIsEditing(false);
  };

  // ====================================================
  // UPDATE PROFILE
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateProfileMutation.mutateAsync(formData);

      setIsEditing(false);
    } catch (error) {
      console.error("Update Company Profile Error:", error);
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
            Loading company profile...
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
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={24} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading your company profile.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="btn-yellow mt-5"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // PROFILE VALUES
  // ====================================================

  const companyName =
    company.companyName ||
    company.name ||
    "Company";

  const companyEmail =
    company.email ||
    company.companyEmail ||
    "—";

  const companyPhone =
    company.phone ||
    company.companyPhone ||
    "—";

  const companyAddress =
    company.address ||
    company.location ||
    "—";

  const companyWebsite =
    company.website ||
    "—";

  const companyDescription =
    company.description ||
    "No company description has been added yet.";

  const companyStatus =
    company.status ||
    (company.isActive ? "Active" : "—");

  const owner =
    company.owner ||
    company.ownerId ||
    {};

  const ownerName =
    owner.name ||
    company.ownerName ||
    "Company Admin";

  const ownerEmail =
    owner.email ||
    company.ownerEmail ||
    companyEmail;

  const createdAt =
    company.createdAt ||
    company.created_at;

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
              Profile
            </span>
          </div>

          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Company Profile
          </h1>

          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Manage your company's information and contact details.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="btn-yellow self-start sm:self-auto"
          >
            <Edit3 size={17} className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* ==================================================
          PROFILE HERO
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-amber-100 via-amber-50 to-slate-100" />

        <div className="px-5 pb-5 sm:px-7">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {/* COMPANY AVATAR */}

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-amber-400 shadow-md">
                {company.logo || company.logoUrl ? (
                  <img
                    src={company.logo || company.logoUrl}
                    alt={companyName}
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <Building2 size={32} />
                )}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {companyName}
                  </h2>

                  <StatusBadge status={companyStatus} />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {companyEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays size={14} />
              Joined {formatDate(createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          EDIT FORM
      ================================================== */}

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* FORM HEADER */}

          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Edit3 size={18} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Company Information
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Update the information displayed for your company.
                </p>
              </div>
            </div>
          </div>

          {/* FORM BODY */}

          <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 md:grid-cols-2">
            <FormField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              icon={Building2}
            />

            <FormField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="company@example.com"
              type="email"
              icon={Mail}
            />

            <FormField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92 XXX XXXXXXX"
              icon={Phone}
            />

            <FormField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              icon={Globe2}
            />

            <div className="md:col-span-2">
              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter company address"
                icon={MapPin}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                label="Company Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers about your company..."
              />
            </div>
          </div>

          {/* FORM ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={handleCancel}
              disabled={updateProfileMutation.isPending}
              className="btn-outline"
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="btn-yellow"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2
                    size={16}
                    className="mr-2 animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* ==================================================
              COMPANY INFORMATION
          ================================================== */}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* COMPANY DETAILS */}

            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Building2 size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Company Information
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Your company's basic information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:p-7">
                <InfoItem
                  icon={Building2}
                  label="Company Name"
                  value={companyName}
                />

                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={companyEmail}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={companyPhone}
                />

                <InfoItem
                  icon={Globe2}
                  label="Website"
                  value={companyWebsite}
                />

                <div className="sm:col-span-2">
                  <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={companyAddress}
                  />
                </div>
              </div>
            </div>

            {/* ADMIN DETAILS */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <User size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Company Admin
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Account owner information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <InfoItem
                  icon={User}
                  label="Name"
                  value={ownerName}
                />

                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={ownerEmail}
                />

                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Role"
                  value="Company Administrator"
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Building2 size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    About Company
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Your company's public description.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-7">
              <p className="max-w-4xl text-sm leading-7 text-slate-600">
                {companyDescription}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyProfile;