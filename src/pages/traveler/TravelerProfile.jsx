// src/pages/traveler/Profile.jsx

import React, { useEffect, useState } from "react";

import {
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  X,
  Edit3,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  BriefcaseBusiness,
  CalendarDays,
  Trash2,
  Camera,
  Globe2,
  Star,
  Users,
  Ticket,
  Wallet,
} from "lucide-react";

import {
  useTravelerProfile,
  useUpdateTravelerProfile,
} from "../../api/queries/useTraveler";

import {
  useUploadSingleImage,
  useDeleteImage,
} from "../../api/queries/useUpload";

import { useUserStats } from "../../api/queries/useSuperAdmin";

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

const formatNumber = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return number.toLocaleString();
};

const formatCurrency = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return number.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  });
};

const getInitials = (name) => {
  if (!name) return "U";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
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

    if (parts[0] && /^v\d+$/.test(parts[0])) {
      parts.shift();
    }

    publicPath = parts.join("/");

    publicPath = publicPath.replace(/\.[^/.]+$/, "");

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
// NORMALIZE PROFILE PICTURE
// ======================================================

const normalizeProfilePicture = (profilePicture) => {
  if (!profilePicture) {
    return {
      url: "",
      public_id: "",
    };
  }

  if (
    typeof profilePicture === "object" &&
    !Array.isArray(profilePicture)
  ) {
    const url =
      profilePicture.url ||
      profilePicture.imageUrl ||
      profilePicture.secure_url ||
      "";

    const public_id =
      profilePicture.public_id ||
      profilePicture.publicId ||
      getCloudinaryPublicId(url);

    return {
      url,
      public_id,
    };
  }

  if (typeof profilePicture === "string") {
    return {
      url: profilePicture,
      public_id: getCloudinaryPublicId(profilePicture),
    };
  }

  return {
    url: "",
    public_id: "",
  };
};

// ======================================================
// GET IMAGE DATA FROM UPLOAD RESPONSE
// ======================================================

const getImageData = (response) => {
  const data =
    response?.data?.image ||
    response?.data ||
    response;

  const url =
    data?.url ||
    data?.imageUrl ||
    data?.secure_url ||
    "";

  const public_id =
    data?.public_id ||
    data?.publicId ||
    getCloudinaryPublicId(url);

  return {
    url,
    public_id,
  };
};

// ======================================================
// ENHANCED INFO ITEM
// ======================================================

const InfoItem = ({
  icon: Icon,
  label,
  value,
  valueColor = "text-slate-800",
}) => {
  return (
    <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/40 transition-all duration-200">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 shadow-sm">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className={`mt-1 break-words text-sm font-medium ${valueColor}`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

// ======================================================
// ENHANCED STAT CARD
// ======================================================

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = "yellow",
  description,
}) => {
  const colors = {
    blue: "from-blue-100 to-blue-50 text-blue-600",
    green: "from-emerald-100 to-emerald-50 text-emerald-600",
    purple: "from-purple-100 to-purple-50 text-purple-600",
    orange: "from-orange-100 to-orange-50 text-orange-600",
    yellow: "from-amber-100 to-amber-50 text-amber-600",
    rose: "from-rose-100 to-rose-50 text-rose-600",
  };

  const bgColors = {
    blue: "bg-blue-50/80 border-blue-100/50",
    green: "bg-emerald-50/80 border-emerald-100/50",
    purple: "bg-purple-50/80 border-purple-100/50",
    orange: "bg-orange-50/80 border-orange-100/50",
    yellow: "bg-amber-50/80 border-amber-100/50",
    rose: "bg-rose-50/80 border-rose-100/50",
  };

  return (
    <div className={`stat-card group relative overflow-hidden rounded-2xl border ${bgColors[color]} p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full bg-gradient-to-br from-amber-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} shadow-sm`}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>

        {description && (
          <span className="text-[11px] font-medium text-slate-400 bg-white/60 px-2.5 py-1 rounded-full border border-slate-100/60">
            {description}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
};

// ======================================================
// ENHANCED FORM FIELD
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
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-rose-400">*</span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-amber-500"
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
          className={`h-11 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 ${
            Icon ? "pl-10" : "px-3.5"
          } pr-3.5`}
        />
      </div>
    </div>
  );
};

// ======================================================
// ENHANCED TEXTAREA
// ======================================================

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all duration-200"
      />
    </div>
  );
};

// ======================================================
// ENHANCED STATUS BADGE
// ======================================================

const StatusBadge = ({ status }) => {
  const normalizedStatus = String(
    status || ""
  ).toLowerCase();

  const isVerified =
    normalizedStatus === "verified" ||
    status === true;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition-all duration-200 ${
        isVerified
          ? "border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100"
          : "border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100"
      }`}
    >
      {isVerified ? (
        <CheckCircle2 size={13} strokeWidth={2.5} />
      ) : (
        <AlertCircle size={13} strokeWidth={2.5} />
      )}

      {isVerified
        ? "Verified"
        : "Not Verified"}
    </span>
  );
};

// ======================================================
// SECTION HEADER
// ======================================================

const SectionHeader = ({ icon: Icon, title, subtitle, iconColor = "amber" }) => {
  const colorMap = {
    amber: "from-amber-100 to-amber-50 text-amber-600",
    blue: "from-blue-100 to-blue-50 text-blue-600",
    emerald: "from-emerald-100 to-emerald-50 text-emerald-600",
    slate: "from-slate-100 to-slate-50 text-slate-600",
  };

  return (
    <div className="gradient-header px-5 md:px-7 py-4 flex items-center gap-3 rounded-t-2xl border-b border-slate-100/80">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[iconColor] || colorMap.amber} shadow-sm`}>
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const TravelerProfile = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "prefer_not_to_say",
    bio: "",
  });

  const [profilePicture, setProfilePicture] =
    useState({
      url: "",
      public_id: "",
    });

  const [newPublicId, setNewPublicId] =
    useState("");

  const [profileError, setProfileError] =
    useState("");

  // ====================================================
  // PROFILE QUERY
  // ====================================================

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useTravelerProfile();

  // ====================================================
  // API DATA
  // ====================================================

  const user =
    response?.data?.user ||
    response?.data ||
    response ||
    {};

  const userId =
    user?._id ||
    user?.id;

  // ====================================================
  // USER STATS QUERY
  // ====================================================

  const {
    data: statsResponse,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useUserStats(userId);

  // ====================================================
  // EXTRACT METRICS
  // ====================================================

  const metrics =
    statsResponse?.data?.metrics ||
    statsResponse?.metrics ||
    {};

  // ====================================================
  // MUTATIONS
  // ====================================================

  const updateProfileMutation =
    useUpdateTravelerProfile();

  const uploadSingleImageMutation =
    useUploadSingleImage();

  const deleteImageMutation =
    useDeleteImage();

  // ====================================================
  // SYNC FORM WITH API DATA
  // ====================================================

  useEffect(() => {
    if (
      !user ||
      Object.keys(user).length === 0
    ) {
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender:
        user.gender || "prefer_not_to_say",
      bio: user.bio || "",
    });

    setProfilePicture(
      normalizeProfilePicture(
        user.profilePicture
      )
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
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender:
        user.gender || "prefer_not_to_say",
      bio: user.bio || "",
    });

    setProfilePicture(
      normalizeProfilePicture(
        user.profilePicture
      )
    );

    setNewPublicId("");
    setProfileError("");
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
  // PROFILE PICTURE UPLOAD
  // ====================================================

  const handleProfilePictureUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileError("");

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error(
          "Please select a valid image file."
        );
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        throw new Error(
          "Profile picture size must be less than 5MB."
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

      if (
        newPublicId &&
        newPublicId !== imageData.public_id
      ) {
        try {
          await deleteCloudinaryImage(
            newPublicId
          );
        } catch (error) {
          console.error(
            "Failed to delete previous temporary image:",
            error
          );
        }
      }

      setProfilePicture({
        url: imageData.url,
        public_id:
          imageData.public_id || "",
      });

      setNewPublicId(
        imageData.public_id || ""
      );
    } catch (error) {
      console.error(
        "Failed to upload profile picture:",
        error
      );

      setProfileError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload profile picture."
      );
    } finally {
      event.target.value = "";
    }
  };

  // ====================================================
  // REMOVE PROFILE PICTURE
  // ====================================================

  const handleRemoveProfilePicture =
    async () => {
      setProfileError("");

      if (newPublicId) {
        try {
          await deleteCloudinaryImage(
            newPublicId
          );

          setNewPublicId("");

          setProfilePicture({
            url: "",
            public_id: "",
          });

          return;
        } catch (error) {
          setProfileError(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to remove profile picture."
          );

          return;
        }
      }

      setProfilePicture({
        url: "",
        public_id: "",
      });
    };

  // ====================================================
  // CANCEL EDIT
  // ====================================================

  const handleCancel = async () => {
    setProfileError("");

    if (newPublicId) {
      try {
        await deleteCloudinaryImage(
          newPublicId
        );
      } catch (error) {
        console.error(
          "Failed to clean up newly uploaded picture:",
          error
        );
      }
    }

    setNewPublicId("");

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender:
        user.gender || "prefer_not_to_say",
      bio: user.bio || "",
    });

    setProfilePicture(
      normalizeProfilePicture(
        user.profilePicture
      )
    );

    setIsEditing(false);
  };

  // ====================================================
  // UPDATE PROFILE
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setProfileError("");

    const oldPicture =
      normalizeProfilePicture(
        user.profilePicture
      );

    try {
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        bio: formData.bio,

        profilePicture: {
          url: profilePicture.url || null,
          public_id:
            profilePicture.public_id || null,
        },
      });

      const pictureChanged =
        oldPicture.url !==
          profilePicture.url ||
        oldPicture.public_id !==
          profilePicture.public_id;

      if (
        pictureChanged &&
        oldPicture.public_id
      ) {
        try {
          await deleteCloudinaryImage(
            oldPicture.public_id
          );
        } catch (deleteError) {
          console.error(
            "Profile updated but old picture cleanup failed:",
            deleteError
          );
        }
      }

      setNewPublicId("");
      setIsEditing(false);

      await refetch();
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      if (
        newPublicId &&
        newPublicId !==
          oldPicture.public_id
      ) {
        try {
          await deleteCloudinaryImage(
            newPublicId
          );
        } catch (cleanupError) {
          console.error(
            "Failed to clean up new picture:",
            cleanupError
          );
        }
      }

      setNewPublicId("");

      setProfileError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile."
      );
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-100">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-200/30 blur-xl animate-pulse" />
            <Loader2
              size={36}
              className="relative animate-spin text-amber-500"
            />
          </div>
          <p className="text-sm font-medium text-slate-600">
            Loading profile...
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
        <div className="w-full max-w-md rounded-2xl border border-rose-200/60 bg-white/90 backdrop-blur-sm p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 text-rose-500">
            <AlertCircle size={28} strokeWidth={1.8} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading
            your profile.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary mt-6"
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

  const userName =
    user.name || "Traveler";

  const userEmail =
    user.email || "—";

  const userPhone =
    user.phone || "—";

  const userGender =
    user.gender ||
    "prefer_not_to_say";

  const userBio =
    user.bio ||
    "No bio added yet. Update your profile to add a bio.";

  const isVerified =
    user.emailVerified || false;

  const createdAt =
    user.createdAt;

  const savedProfilePicture =
    normalizeProfilePicture(
      user.profilePicture
    );

  // ====================================================
  // TRAVELER STATS
  // ====================================================

  const totalReviews =
    metrics.totalReviews || 0;

  const averageRating =
    metrics.averageRating || 0;

  const totalBookings =
    metrics.totalBookings || 0;

  const completedBookings =
    metrics.completedBookings || 0;

  const destinationsVisited =
    metrics.destinationsVisited || 0;

  const totalSpent =
    metrics.totalSpent || 0;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="max-w-7xl mx-auto  pb-10 px-4 sm:px-6 md:px-7 px-4 sm:px-6 lg:px-8 py-6 my-4 space-y-7">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-amber-600 tracking-wide">
              My Account
            </p>

            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-200/50">
              Profile
            </span>
          </div>

          <h1 className="mt-1 text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Traveler Profile
          </h1>

          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Manage your personal information
            and view your travel activity.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="btn-primary self-start sm:self-auto shadow-amber-200/40 hover:shadow-amber-300/50 transition-all duration-300"
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

      <div className="card relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        <div className="h-24 md:h-28 bg-gradient-to-r from-amber-100 via-amber-50/80 to-white/90" />
        
        <div className="px-5 md:px-7 pb-6 -mt-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <div className="flex h-20 w-20 md:h-24 md:w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-slate-800 to-slate-700 text-amber-300 profile-image-container">
                  {savedProfilePicture.url ? (
                    <img
                      src={savedProfilePicture.url}
                      alt={userName}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-2xl md:text-3xl font-bold text-amber-400">
                      {getInitials(userName)}
                    </span>
                  )}
                </div>
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-400 rounded-full p-1.5 border-2 border-white shadow-sm">
                    <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-800">
                    {userName}
                  </h2>

                  <StatusBadge status={isVerified} />
                </div>

                <p className="mt-0.5 text-sm text-slate-500">
                  {userEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/70 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
              <CalendarDays size={14} strokeWidth={1.8} />
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
          className="card overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm"
        >
          <SectionHeader 
            icon={Edit3} 
            title="Edit Profile Information" 
            subtitle="Update your personal information."
          />

          <div className="grid grid-cols-1 gap-5 p-5 md:p-7 md:grid-cols-2">

            {/* PROFILE PICTURE */}

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Profile Picture
              </label>

              <div className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 items-center transition-all duration-200 hover:border-amber-200/50">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-white shadow-sm">
                  {profilePicture.url ? (
                    <img
                      src={profilePicture.url}
                      alt="Profile picture"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={34} className="text-slate-300" strokeWidth={1.5} />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    Profile Picture
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    JPG, PNG or WebP · Max 5MB
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all duration-200 hover:border-amber-300 ${
                        uploadSingleImageMutation.isPending
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      {uploadSingleImageMutation.isPending ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Camera size={15} />
                      )}

                      {uploadSingleImageMutation.isPending
                        ? "Uploading..."
                        : profilePicture.url
                        ? "Change Picture"
                        : "Upload Picture"}

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={handleProfilePictureUpload}
                      />
                    </label>

                    {profilePicture.url && (
                      <button
                        type="button"
                        onClick={handleRemoveProfilePicture}
                        disabled={deleteImageMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleteImageMutation.isPending ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                        Remove
                      </button>
                    )}
                  </div>

                  {profileError && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200/60 bg-rose-50/60 px-3 py-2.5">
                      <AlertCircle size={14} className="mt-0.5 shrink-0 text-rose-500" />
                      <p className="text-xs text-rose-600">
                        {profileError}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FORM FIELDS */}

            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={User}
              required
            />

            <FormField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              type="email"
              icon={Mail}
              disabled
            />

            <FormField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92 XXX XXXXXXX"
              icon={Phone}
              required
            />

            <div>
              <label
                htmlFor="gender"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Gender
              </label>

              <div className="relative">
                <Users
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all duration-200 appearance-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <TextareaField
                label="Bio / About Me"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-7 bg-slate-50/30 rounded-b-2xl">
            <button
              type="button"
              onClick={handleCancel}
              disabled={
                updateProfileMutation.isPending ||
                uploadSingleImageMutation.isPending ||
                deleteImageMutation.isPending
              }
              className="btn-outline"
            >
              <X size={16} className="mr-2" />
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
        </form>
      ) : (
        <>

          {/* ==================================================
              PERSONAL INFORMATION + ACCOUNT SUMMARY
          ================================================== */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Personal Info */}
            <div className="card lg:col-span-2 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
              <SectionHeader 
                icon={User} 
                title="Personal Information" 
                subtitle="Your basic personal information."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-5 md:p-7">
                <InfoItem
                  icon={User}
                  label="Full Name"
                  value={userName}
                />

                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={userEmail}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={userPhone}
                />

                <InfoItem
                  icon={Users}
                  label="Gender"
                  value={userGender
                    .split("_")
                    .join(" ")
                    .toUpperCase()}
                />

                <div className="sm:col-span-2">
                  <InfoItem
                    icon={CheckCircle2}
                    label="Email Verification"
                    value={
                      isVerified
                        ? "Verified"
                        : "Not Verified"
                    }
                    valueColor={isVerified ? "text-emerald-600" : "text-amber-600"}
                  />
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="card overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
              <SectionHeader 
                icon={CalendarDays} 
                title="Account Summary" 
                subtitle="Quick account overview."
                iconColor="slate"
              />

              <div className="space-y-2 p-5">
                <InfoItem
                  icon={Calendar}
                  label="Member Since"
                  value={formatDate(createdAt)}
                />

                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Account Type"
                  value="Traveler"
                />

                <InfoItem
                  icon={CheckCircle2}
                  label="Status"
                  value={
                    isVerified
                      ? "Active"
                      : "Pending Verification"
                  }
                  valueColor={isVerified ? "text-emerald-600" : "text-amber-600"}
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              TRAVEL STATISTICS
          ================================================== */}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Travel Statistics
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Your activity and travel history at a glance.
                </p>
              </div>
            </div>

            {statsLoading ? (
              <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Loader2 size={20} className="animate-spin text-amber-500" />
                  Loading travel statistics...
                </div>
              </div>
            ) : statsError ? (
              <div className="rounded-2xl border border-amber-200/60 bg-amber-50/60 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">
                        Unable to load travel statistics
                      </p>
                      <p className="mt-0.5 text-xs text-amber-700">
                        Your profile is available, but your activity statistics could not be loaded.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => refetchStats()}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-200/60 bg-white/80 px-3.5 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-all duration-200"
                  >
                    <RefreshCw size={14} />
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                  icon={Ticket}
                  label="Total Bookings"
                  value={formatNumber(totalBookings)}
                  color="blue"
                  description={`${formatNumber(completedBookings)} completed`}
                />

                <StatCard
                  icon={Star}
                  label="Reviews"
                  value={formatNumber(totalReviews)}
                  color="yellow"
                  description={
                    averageRating > 0
                      ? `${averageRating}/5 rating`
                      : "No rating yet"
                  }
                />

                <StatCard
                  icon={Globe2}
                  label="Destinations"
                  value={formatNumber(destinationsVisited)}
                  color="purple"
                  description="Places visited"
                />

                <StatCard
                  icon={Wallet}
                  label="Total Spent"
                  value={`Rs. ${formatCurrency(totalSpent)}`}
                  color="green"
                  description="Paid bookings"
                />

                <StatCard
                  icon={Star}
                  label="Average Rating"
                  value={
                    averageRating > 0
                      ? `${averageRating}/5`
                      : "—"
                  }
                  color="orange"
                  description={
                    totalReviews > 0
                      ? `${formatNumber(totalReviews)} reviews`
                      : "No reviews"
                  }
                />
              </div>
            )}
          </div>

          {/* ==================================================
              BOOKING BREAKDOWN
          ================================================== */}

          <div className="card overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <SectionHeader 
              icon={Ticket} 
              title="Booking Activity" 
              subtitle="Overview of your tour bookings."
            />

            <div className="grid grid-cols-2 gap-4 p-5 md:grid-cols-4 md:p-7">
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 p-4 border border-amber-200/40 transition-all duration-200 hover:shadow-md">
                <p className="text-2xl font-bold text-amber-700">
                  {formatNumber(metrics.pendingBookings || 0)}
                </p>
                <p className="mt-1 text-xs font-semibold text-amber-600 tracking-wide">
                  Pending
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 p-4 border border-blue-200/40 transition-all duration-200 hover:shadow-md">
                <p className="text-2xl font-bold text-blue-700">
                  {formatNumber(metrics.confirmedBookings || 0)}
                </p>
                <p className="mt-1 text-xs font-semibold text-blue-600 tracking-wide">
                  Confirmed
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-4 border border-emerald-200/40 transition-all duration-200 hover:shadow-md">
                <p className="text-2xl font-bold text-emerald-700">
                  {formatNumber(metrics.completedBookings || 0)}
                </p>
                <p className="mt-1 text-xs font-semibold text-emerald-600 tracking-wide">
                  Completed
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/60 p-4 border border-rose-200/40 transition-all duration-200 hover:shadow-md">
                <p className="text-2xl font-bold text-rose-700">
                  {formatNumber(metrics.cancelledBookings || 0)}
                </p>
                <p className="mt-1 text-xs font-semibold text-rose-600 tracking-wide">
                  Cancelled
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              BIO / ABOUT
          ================================================== */}

          <div className="card overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <SectionHeader 
              icon={User} 
              title="About Me" 
              subtitle="A little about yourself."
            />

            <div className="px-5 py-5 md:px-7">
              <p className="max-w-4xl text-sm leading-7 text-slate-600">
                {userBio}
              </p>
            </div>
          </div>

        </>
      )}

    </div>
  );
};

export default TravelerProfile;