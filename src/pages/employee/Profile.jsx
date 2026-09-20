// src/pages/employee/Profile.jsx

import React, { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  Calendar,
  Save,
  User,
  Shield,
  MapPin,
  Edit3,
  Image as ImageIcon,
  Trash2,
  X,
} from "lucide-react";

import {
  useMyProfile,
  useUpdateMyProfile,
  useMyCompany,
} from "../../api/queries/useEmployee";

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

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() || "EM";
  }

  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
};

// ======================================================
// EXTRACT CLOUDINARY PUBLIC ID FROM URL
// ======================================================

const getCloudinaryPublicId = (url) => {
    console.log(url,"ppp");
    
  if (!url || typeof url !== "string") return "";

  try {
    const uploadPart = "/upload/";
    const uploadIndex = url.indexOf(uploadPart);

    if (uploadIndex === -1) return "";

    let publicPath = url.substring(uploadIndex + uploadPart.length);
    const parts = publicPath.split("/");

    if (parts[0] && /^v\d+$/.test(parts[0])) {
      parts.shift();
    }

    publicPath = parts.join("/");
    publicPath = publicPath.replace(/\.[^/.]+$/, "");

    return publicPath;
  } catch (error) {
    console.error("Failed to extract Cloudinary public ID:", error);
    return "";
  }
};

// ======================================================
// IMAGE RESPONSE HELPER
// ======================================================

const getImageData = (response) => {
    console.log(response," res");
    
  const data =
    response?.data?.image ||
    response?.data?.avatar ||
    response?.data ||
    response;

  return {
    url: data?.url || data?.imageUrl || data?.secure_url || "",
    public_id: data?.public_id || data?.publicId || "",
  };
};

// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <Shield size={12} />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      <Shield size={12} />
      Inactive
    </span>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Profile = () => {
  // ====================================================
  // QUERIES
  // ====================================================

  const {
    data: profileResponse,
    isLoading,
    isError,
    refetch,
  } = useMyProfile();

  const { data: companyResponse } = useMyCompany();

  const updateMutation = useUpdateMyProfile();

  // ====================================================
  // IMAGE MUTATIONS
  // ====================================================

  const uploadSingleImageMutation = useUploadSingleImage();
  const deleteImageMutation = useDeleteImage();

  // ====================================================
  // API DATA
  // ====================================================
console.log(profileResponse);

  const profile = profileResponse?.data || {};
  const user = profile?.user || {};
  const company = companyResponse?.data || {};

  // ====================================================
  // FORM STATE
  // ====================================================

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    designation: "",
    department: "",
    address: "",
  });

  // ====================================================
  // AVATAR STATE
  // ====================================================

  const [avatar, setAvatar] = useState("");
  const [currentAvatarPublicId, setCurrentAvatarPublicId] = useState("");
  const [newAvatarPublicId, setNewAvatarPublicId] = useState("");
  const [avatarError, setAvatarError] = useState("");

  // ====================================================
  // SYNC FORM WHEN PROFILE LOADS
  // ====================================================

  useEffect(() => {
    if (profile?._id) {
      setForm({
        name: user?.name || "",
        phone: user?.phone || "",
        gender: user?.gender || "",
        designation: profile?.designation || "",
        department: profile?.department || "",
        address: profile?.address || "",
      });

      const savedAvatar = user?.avatar || "";
      setAvatar(savedAvatar);
      setCurrentAvatarPublicId(getCloudinaryPublicId(savedAvatar));
    }
  }, [
    profile?._id,
    user?.name,
    user?.phone,
    user?.gender,
    user?.avatar,
    profile?.designation,
    profile?.department,
    profile?.address,
  ]);

  // ====================================================
  // HANDLERS - FORM
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
    setAvatarError("");

    // Reset avatar to original when entering edit mode
    const savedAvatar = user?.avatar || "";
    setAvatar(savedAvatar);
    setCurrentAvatarPublicId(getCloudinaryPublicId(savedAvatar));
    setNewAvatarPublicId("");
  };

  const handleCancel = async () => {
    setError("");
    setSuccess("");
    setAvatarError("");

    // Clean up newly uploaded avatar if user cancels
    if (newAvatarPublicId) {
      try {
        await deleteImageMutation.mutateAsync(newAvatarPublicId);
      } catch (err) {
        console.error("Failed to clean up newly uploaded avatar:", err);
      }
    }

    setNewAvatarPublicId("");

    // Reset form to original
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      designation: profile?.designation || "",
      department: profile?.department || "",
      address: profile?.address || "",
    });

    const savedAvatar = user?.avatar || "";
    setAvatar(savedAvatar);
    setCurrentAvatarPublicId(getCloudinaryPublicId(savedAvatar));

    setIsEditing(false);
  };

  // ====================================================
  // AVATAR UPLOAD
  // ====================================================

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB.");
      }

      const response = await uploadSingleImageMutation.mutateAsync(file);
      const imageData = getImageData(response);
console.log(imageData,"image data");

      if (!imageData.url) {
        throw new Error("Server did not return an image URL.");
      }

      // If there's already a newly uploaded (uncommitted) avatar, delete it
      if (newAvatarPublicId && newAvatarPublicId !== imageData.public_id) {
        try {
          await deleteImageMutation.mutateAsync(newAvatarPublicId);
        } catch (err) {
          console.error("Failed to clean up previous uploaded avatar:", err);
        }
      }

      setAvatar(imageData.url);

      const uploadedPublicId =
        imageData.public_id || getCloudinaryPublicId(imageData.url);

      setNewAvatarPublicId(uploadedPublicId);
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      setAvatarError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload avatar."
      );
    } finally {
      event.target.value = "";
    }
  };

  // ====================================================
  // REMOVE AVATAR
  // ====================================================

  const handleRemoveAvatar = async () => {
    setAvatarError("");

    // If it's a newly uploaded avatar, delete it immediately from Cloudinary
    if (newAvatarPublicId) {
      try {
        await deleteImageMutation.mutateAsync(newAvatarPublicId);
        setNewAvatarPublicId("");
        setAvatar("");
        return;
      } catch (err) {
        setAvatarError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to remove avatar."
        );
        return;
      }
    }

    // Otherwise, just clear the local avatar (will be saved on submit)
    setAvatar("");
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setError("");
    setSuccess("");
    setAvatarError("");

    const oldAvatar = user?.avatar || "";
    const oldAvatarPublicId = getCloudinaryPublicId(oldAvatar);

    try {
      await updateMutation.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        designation: form.designation.trim(),
        department: form.department.trim(),
        address: form.address.trim(),
        avatar: avatar || "",
      });

      // If avatar changed, delete the old Cloudinary image
      const avatarChanged = oldAvatar !== avatar;

      if (avatarChanged && oldAvatarPublicId) {
        try {
          await deleteImageMutation.mutateAsync(oldAvatarPublicId);
        } catch (deleteErr) {
          console.error(
            "Profile updated but old avatar cleanup failed:",
            deleteErr
          );
        }
      }

      setCurrentAvatarPublicId(getCloudinaryPublicId(avatar));
      setNewAvatarPublicId("");

      setSuccess("Profile updated successfully.");
      setIsEditing(false);

      await refetch();
    } catch (err) {
      console.error("Update profile error:", err);

      // Clean up newly uploaded avatar on failure
      if (newAvatarPublicId) {
        try {
          await deleteImageMutation.mutateAsync(newAvatarPublicId);
        } catch (cleanupErr) {
          console.error(
            "Failed to clean up new avatar after update failure:",
            cleanupErr
          );
        }
      }

      setNewAvatarPublicId("");

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update profile."
      );
    }
  };

  // ====================================================
  // INITIAL LOADING
  // ====================================================

  if (isLoading && !profileResponse) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-yellow-500" />
          <p className="text-sm text-text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (isError && !profileResponse) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-rose-100 bg-bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <AlertCircle size={24} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Something went wrong while loading your profile.
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
  // LOADING FLAGS
  // ====================================================

  const isUploadingAvatar = uploadSingleImageMutation.isPending;
  const isDeletingAvatar = deleteImageMutation.isPending;
  const isSaving = updateMutation.isPending;
  const isBusy = isUploadingAvatar || isDeletingAvatar || isSaving;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-yellow-600">
              Employee Portal
            </p>
            <span className="badge-yellow">Profile</span>
          </div>

          <h1 className="mt-1 text-3xl font-semibold text-text-primary">
            My Profile
          </h1>

          <p className="mt-1 max-w-xl text-sm text-text-muted">
            Manage your personal information and preferences.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="btn-primary self-start cursor-pointer sm:self-auto"
          >
            <Edit3 size={16} className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* ALERTS */}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Shield size={16} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* PROFILE HEADER CARD */}

      <div className="rounded-2xl border border-border-subtle bg-bg-card p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-lg font-semibold text-yellow-600 overflow-hidden">
            {avatar || user?.avatar ? (
              <img
                src={avatar || user?.avatar}
                alt={user?.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
            ) : (
              getInitials(user?.name || "")
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-text-primary">
                {user?.name || "Employee"}
              </h2>
              <StatusBadge status={profile?.status} />
            </div>

            <p className="mt-1 text-sm text-text-muted">
              {profile?.designation || "Employee"} •{" "}
              {profile?.department || "General"}
            </p>
          </div>
        </div>
      </div>

      {/* FORM / INFO */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* PERSONAL INFO */}

        <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <User size={18} className="text-yellow-600" />
            <h2 className="text-lg font-semibold text-text-primary">
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* AVATAR UPLOAD - Only visible in edit mode */}
            {isEditing && (
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Profile Picture
                </label>

                <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-slate-50 p-4 sm:flex-row sm:items-center">
                  {/* AVATAR PREVIEW */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-white">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-slate-300">
                        {getInitials(user?.name || "")}
                      </span>
                    )}
                  </div>

                  {/* AVATAR ACTIONS */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      Profile Picture
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      JPG, PNG or WebP · Max 5MB
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-xs font-bold text-text-secondary hover:bg-slate-50 ${
                          isUploadingAvatar
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      >
                        {isUploadingAvatar ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <ImageIcon size={15} />
                        )}

                        {isUploadingAvatar
                          ? "Uploading..."
                          : avatar
                          ? "Change Photo"
                          : "Upload Photo"}

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </label>

                      {avatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          disabled={isDeletingAvatar}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeletingAvatar ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {avatarError && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
                        <AlertCircle
                          size={14}
                          className="mt-0.5 shrink-0 text-rose-500"
                        />
                        <p className="text-xs text-rose-600">{avatarError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* NAME */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Full Name
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-border-subtle bg-bg-card px-3 text-sm text-text-primary outline-none focus:border-yellow-400"
                  />
                ) : (
                  <p className="flex h-11 items-center text-sm font-medium text-text-primary">
                    {user?.name || "—"}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Email
                </label>

                <p className="flex h-11 items-center text-sm text-text-secondary">
                  {user?.email || "—"}
                </p>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Phone
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="h-11 w-full rounded-xl border border-border-subtle bg-bg-card px-3 text-sm text-text-primary outline-none placeholder:text-slate-400 focus:border-yellow-400"
                  />
                ) : (
                  <p className="flex h-11 items-center text-sm text-text-secondary">
                    {user?.phone || "—"}
                  </p>
                )}
              </div>

              {/* GENDER */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Gender
                </label>

                {isEditing ? (
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="h-11 w-full cursor-pointer rounded-xl border border-border-subtle bg-bg-card px-3 text-sm text-text-primary outline-none focus:border-yellow-400"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="flex h-11 items-center text-sm capitalize text-text-secondary">
                    {user?.gender || "—"}
                  </p>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            {isEditing && (
              <div className="flex justify-end gap-3 border-t border-border-subtle pt-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isBusy}
                  className="btn-outline cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isBusy}
                  className="btn-primary cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
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
            )}
          </form>
        </div>

        {/* WORK INFO */}

        <div className="rounded-2xl border border-border-subtle bg-bg-card p-6">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={18} className="text-yellow-600" />
            <h2 className="text-lg font-semibold text-text-primary">
              Work Info
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            {/* DESIGNATION */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Designation
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Tour Manager"
                  className="h-11 w-full rounded-xl border border-border-subtle bg-bg-card px-3 text-sm text-text-primary outline-none placeholder:text-slate-400 focus:border-yellow-400"
                />
              ) : (
                <p className="text-sm font-medium text-text-primary">
                  {profile?.designation || "—"}
                </p>
              )}
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Department
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Operations"
                  className="h-11 w-full rounded-xl border border-border-subtle bg-bg-card px-3 text-sm text-text-primary outline-none placeholder:text-slate-400 focus:border-yellow-400"
                />
              ) : (
                <p className="text-sm font-medium text-text-primary">
                  {profile?.department || "—"}
                </p>
              )}
            </div>

            {/* JOINING DATE */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Joining Date
              </label>

              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar size={14} className="text-slate-400" />
                {formatDate(profile?.joiningDate)}
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Address
              </label>

              {isEditing ? (
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Your address"
                  className="w-full resize-none rounded-xl border border-border-subtle bg-bg-card px-3 py-3 text-sm text-text-primary outline-none placeholder:text-slate-400 focus:border-yellow-400"
                />
              ) : (
                <div className="flex items-start gap-2 text-sm text-text-secondary">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                  {profile?.address || "—"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPANY INFO */}

      <div className="rounded-2xl border border-border-subtle bg-bg-card p-6">
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-yellow-600" />
          <h2 className="text-lg font-semibold text-text-primary">Company</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Company Name
            </p>
            <p className="mt-2 truncate text-sm font-medium text-text-primary">
              {company?.companyName || "—"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <Mail size={14} />
              Email
            </div>
            <p className="mt-2 truncate text-sm font-medium text-text-primary">
              {company?.email || "—"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <Phone size={14} />
              Phone
            </div>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {company?.phone || "—"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <MapPin size={14} />
              Address
            </div>
            <p className="mt-2 truncate text-sm font-medium text-text-primary">
              {company?.address || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;