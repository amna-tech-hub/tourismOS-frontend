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
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

import {
  useCompanyProfile,
  useUpdateCompanyProfile,
} from "../../api/queries/useCompany";

import {
  useUploadSingleImage,
  useDeleteImage,
} from "../../api/queries/useUpload";

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
// EXTRACT CLOUDINARY PUBLIC ID FROM URL
// ======================================================

const getCloudinaryPublicId = (url) => {
  if (!url || typeof url !== "string") {
    return "";
  }

  try {
    const uploadPart = "/upload/";

    const uploadIndex = url.indexOf(uploadPart);

    if (uploadIndex === -1) {
      return "";
    }

    let publicPath = url.substring(
      uploadIndex + uploadPart.length
    );

    const parts = publicPath.split("/");

    if (
      parts[0] &&
      /^v\d+$/.test(parts[0])
    ) {
      parts.shift();
    }

    publicPath = parts.join("/");

    publicPath = publicPath.replace(
      /\.[^/.]+$/,
      ""
    );

    return publicPath;
  } catch (error) {
    console.error(
      "Failed to extract Cloudinary public ID:",
      error
    );

    return "";
  }
};

// ======================================================
// IMAGE RESPONSE HELPER
// ======================================================

const getImageData = (response) => {
  const data =
    response?.data?.image ||
    response?.data?.coverImage ||
    response?.data ||
    response;

  return {
    url:
      data?.url ||
      data?.imageUrl ||
      data?.secure_url ||
      "",

    public_id:
      data?.public_id ||
      data?.publicId ||
      "",
  };
};

// ======================================================
// INFO ITEM
// ======================================================

const InfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
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
          className={`h-11 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 ${
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
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
      />
    </div>
  );
};

// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = ({ status }) => {
  const normalizedStatus =
    String(status || "").toLowerCase();

  const isActive =
    normalizedStatus === "active" ||
    normalizedStatus === "approved" ||
    normalizedStatus === "verified";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
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

  const [logo, setLogo] = useState("");

  const [currentLogoPublicId, setCurrentLogoPublicId] =
    useState("");

  const [newLogoPublicId, setNewLogoPublicId] =
    useState("");

  const [logoError, setLogoError] = useState("");

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
  // MUTATIONS
  // ====================================================

  const updateProfileMutation =
    useUpdateCompanyProfile();

  const uploadSingleImageMutation =
    useUploadSingleImage();

  const deleteImageMutation =
    useDeleteImage();

  // ====================================================
  // API DATA
  // ====================================================

  const company =
    response?.data ||
    response?.company ||
    response ||
    {};

  // ====================================================
  // SYNC FORM WITH API DATA
  // ====================================================

  useEffect(() => {
    if (
      !company ||
      Object.keys(company).length === 0
    ) {
      return;
    }

    setFormData({
      companyName:
        company.companyName || "",

      email:
        company.email || "",

      phone:
        company.phone || "",

      address:
        company.address || "",

      website:
        company.website || "",

      description:
        company.description || "",
    });

    const savedLogo =
      company.logo ||
      company.logoUrl ||
      "";

    setLogo(savedLogo);

    setCurrentLogoPublicId(
      getCloudinaryPublicId(savedLogo)
    );
  }, [response]);

  // ====================================================
  // HANDLE INPUT
  // ====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

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
      companyName:
        company.companyName || "",

      email:
        company.email || "",

      phone:
        company.phone || "",

      address:
        company.address || "",

      website:
        company.website || "",

      description:
        company.description || "",
    });

    const savedLogo =
      company.logo ||
      company.logoUrl ||
      "";

    setLogo(savedLogo);

    setCurrentLogoPublicId(
      getCloudinaryPublicId(savedLogo)
    );

    setNewLogoPublicId("");
    setLogoError("");

    setIsEditing(true);
  };

  // ====================================================
  // DELETE CLOUDINARY IMAGE
  // ====================================================

  const deleteCloudinaryImage = async (
    publicId
  ) => {
    if (!publicId) {
      return;
    }

    try {
      await deleteImageMutation.mutateAsync(
        publicId
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to delete Cloudinary image:",
        error
      );

      throw error;
    }
  };

  // ====================================================
  // LOGO UPLOAD
  // ====================================================

  const handleLogoUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setLogoError("");

    try {
      if (
        !file.type.startsWith("image/")
      ) {
        throw new Error(
          "Please select a valid image file."
        );
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        throw new Error(
          "Logo size must be less than 5MB."
        );
      }

      const response =
        await uploadSingleImageMutation.mutateAsync(
          file
        );

      const imageData =
        getImageData(response);

      if (!imageData.url) {
        throw new Error(
          "Server did not return an image URL."
        );
      }

      setLogo(imageData.url);

      const uploadedPublicId =
        imageData.public_id ||
        getCloudinaryPublicId(
          imageData.url
        );

      setNewLogoPublicId(
        uploadedPublicId
      );
    } catch (error) {
      console.error(
        "Failed to upload company logo:",
        error
      );

      setLogoError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload company logo."
      );
    } finally {
      event.target.value = "";
    }
  };

  // ====================================================
  // REMOVE LOGO FROM FORM
  // ====================================================

  const handleRemoveLogo = async () => {
    setLogoError("");

    if (newLogoPublicId) {
      try {
        await deleteCloudinaryImage(
          newLogoPublicId
        );

        setNewLogoPublicId("");
        setLogo("");

        return;
      } catch (error) {
        setLogoError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to remove logo."
        );

        return;
      }
    }

    setLogo("");
  };

  // ====================================================
  // CANCEL EDIT
  // ====================================================

  const handleCancel = async () => {
    setLogoError("");

    if (newLogoPublicId) {
      try {
        await deleteCloudinaryImage(
          newLogoPublicId
        );
      } catch (error) {
        console.error(
          "Failed to clean up newly uploaded logo:",
          error
        );
      }
    }

    setNewLogoPublicId("");

    const savedLogo =
      company.logo ||
      company.logoUrl ||
      "";

    setFormData({
      companyName:
        company.companyName || "",

      email:
        company.email || "",

      phone:
        company.phone || "",

      address:
        company.address || "",

      website:
        company.website || "",

      description:
        company.description || "",
    });

    setLogo(savedLogo);

    setCurrentLogoPublicId(
      getCloudinaryPublicId(savedLogo)
    );

    setIsEditing(false);
  };

  // ====================================================
  // UPDATE PROFILE
  // ====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setLogoError("");

    const oldLogo =
      company.logo ||
      company.logoUrl ||
      "";

    const oldLogoPublicId =
      getCloudinaryPublicId(
        oldLogo
      );

    try {
      await updateProfileMutation.mutateAsync(
        {
          ...formData,
          logo: logo || null,
        }
      );

      const logoChanged =
        oldLogo !== logo;

      if (
        logoChanged &&
        oldLogoPublicId
      ) {
        try {
          await deleteCloudinaryImage(
            oldLogoPublicId
          );
        } catch (deleteError) {
          console.error(
            "Profile updated but old logo cleanup failed:",
            deleteError
          );
        }
      }

      setCurrentLogoPublicId(
        getCloudinaryPublicId(
          logo
        )
      );

      setNewLogoPublicId("");

      setIsEditing(false);

      await refetch();
    } catch (error) {
      console.error(
        "Update Company Profile Error:",
        error
      );

      if (
        newLogoPublicId
      ) {
        try {
          await deleteCloudinaryImage(
            newLogoPublicId
          );
        } catch (cleanupError) {
          console.error(
            "Failed to clean up new logo after profile update failure:",
            cleanupError
          );
        }
      }

      setNewLogoPublicId("");

      setLogoError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update company profile."
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
            className="animate-spin text-yellow-500"
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
        <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
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
            className="btn-primary mt-5"
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
    (company.isActive
      ? "Active"
      : "—");

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
            <p className="text-sm font-medium text-yellow-600">
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
            className="btn-primary self-start sm:self-auto"
          >
            <Edit3
              size={17}
              className="mr-2"
            />
            Edit Profile
          </button>
        )}
      </div>

      {/* ==================================================
          PROFILE HERO
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="h-28 bg-gradient-to-r from-yellow-100 via-yellow-50 to-white" />

        <div className="px-5 pb-5 sm:px-7">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="flex items-end gap-4">

              {/* COMPANY LOGO */}

              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-900 text-yellow-400">
                {company.logo ||
                company.logoUrl ? (
                  <img
                    src={
                      company.logo ||
                      company.logoUrl
                    }
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

                  <StatusBadge
                    status={
                      companyStatus
                    }
                  />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {companyEmail}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays size={14} />
              Joined{" "}
              {formatDate(
                createdAt
              )}
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
          className="rounded-2xl border border-slate-200 bg-white"
        >

          {/* FORM HEADER */}

          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
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

            {/* ==========================================
                COMPANY LOGO
            ========================================== */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Company Logo
              </label>

              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">

                {/* LOGO PREVIEW */}

                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">

                  {logo ? (
                    <img
                      src={logo}
                      alt="Company logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2
                      size={32}
                      className="text-slate-300"
                    />
                  )}

                </div>

                {/* LOGO ACTIONS */}

                <div className="flex-1">

                  <p className="text-sm font-semibold text-slate-800">
                    Company Logo
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPG, PNG or WebP · Max 5MB
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">

                    <label
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 ${
                        uploadSingleImageMutation.isPending
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >

                      {uploadSingleImageMutation.isPending ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <ImageIcon
                          size={15}
                        />
                      )}

                      {uploadSingleImageMutation.isPending
                        ? "Uploading..."
                        : logo
                        ? "Change Logo"
                        : "Upload Logo"}

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={
                          handleLogoUpload
                        }
                      />

                    </label>

                    {logo && (
                      <button
                        type="button"
                        onClick={
                          handleRemoveLogo
                        }
                        disabled={
                          deleteImageMutation.isPending
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {deleteImageMutation.isPending ? (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2
                            size={15}
                          />
                        )}

                        Remove Logo

                      </button>
                    )}

                  </div>

                  {logoError && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">

                      <AlertCircle
                        size={14}
                        className="mt-0.5 shrink-0 text-rose-500"
                      />

                      <p className="text-xs text-rose-600">
                        {logoError}
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* COMPANY NAME */}

            <FormField
              label="Company Name"
              name="companyName"
              value={
                formData.companyName
              }
              onChange={
                handleChange
              }
              placeholder="Enter company name"
              icon={Building2}
            />

            {/* EMAIL */}

            <FormField
              label="Email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="company@example.com"
              type="email"
              icon={Mail}
            />

            {/* PHONE */}

            <FormField
              label="Phone"
              name="phone"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              placeholder="+92 XXX XXXXXXX"
              icon={Phone}
            />

            {/* WEBSITE */}

            <FormField
              label="Website"
              name="website"
              value={
                formData.website
              }
              onChange={
                handleChange
              }
              placeholder="https://example.com"
              icon={Globe2}
            />

            {/* ADDRESS */}

            <div className="md:col-span-2">

              <FormField
                label="Address"
                name="address"
                value={
                  formData.address
                }
                onChange={
                  handleChange
                }
                placeholder="Enter company address"
                icon={MapPin}
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <TextareaField
                label="Company Description"
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Tell customers about your company..."
              />

            </div>

          </div>

          {/* FORM ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">

            <button
              type="button"
              onClick={
                handleCancel
              }
              disabled={
                updateProfileMutation.isPending ||
                uploadSingleImageMutation.isPending ||
                deleteImageMutation.isPending
              }
              className="btn-outline"
            >
              <X
                size={16}
                className="mr-2"
              />
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                updateProfileMutation.isPending ||
                uploadSingleImageMutation.isPending ||
                deleteImageMutation.isPending
              }
              className="btn-primary"
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
                  <Save
                    size={16}
                    className="mr-2"
                  />

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

            <div className="rounded-2xl border border-slate-200 bg-white lg:col-span-2">

              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
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
                  value={
                    companyName
                  }
                />

                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={
                    companyEmail
                  }
                />

                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={
                    companyPhone
                  }
                />

                <InfoItem
                  icon={Globe2}
                  label="Website"
                  value={
                    companyWebsite
                  }
                />

                <div className="sm:col-span-2">

                  <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={
                      companyAddress
                    }
                  />

                </div>

              </div>

            </div>

            {/* ADMIN DETAILS */}

            <div className="rounded-2xl border border-slate-200 bg-white">

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
                  value={
                    ownerName
                  }
                />

                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={
                    ownerEmail
                  }
                />

                <InfoItem
                  icon={
                    BriefcaseBusiness
                  }
                  label="Role"
                  value="Company Administrator"
                />

              </div>

            </div>

          </div>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white">

            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
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