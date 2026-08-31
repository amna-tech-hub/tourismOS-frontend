import api from "../axios"; // Adjust to your axios instance path

export const uploadApi = {
  // Upload Single Image (multipart/form-data)
  uploadSingleImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file); // Must match backend upload.single("image")

    const response = await api.post("/upload/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload Multiple Images (max 5)
  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    // Append each file under key 'images' to match upload.array("images", 5)
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Generate Cover Image using AI
  generateCoverImage: async ({ prompt }) => {
    const response = await api.post("/tours/generate-cover-image", { prompt });
    return response.data;
  },
   deleteImage: async (public_id) => {
    const { data } = await api.delete("/upload/image", {
      data: {
        public_id,
      },
    });

    return data;
  },
};