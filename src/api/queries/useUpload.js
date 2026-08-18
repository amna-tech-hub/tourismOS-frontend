import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "../endpoints/upload.api";

// 1. Hook for Uploading a Single Image (e.g., Tour Cover Image)
export const useUploadSingleImage = () => {
  return useMutation({
    mutationFn: (file) => uploadApi.uploadSingleImage(file),
  });
};

// 2. Hook for Uploading Multiple Images (e.g., Tour Gallery)
export const useUploadMultipleImages = () => {
  return useMutation({
    mutationFn: (files) => uploadApi.uploadMultipleImages(files),
  });
};

// 3. Hook for AI Cover Image Generation
export const useGenerateCoverImage = () => {
  return useMutation({
    mutationFn: ({ prompt }) => uploadApi.generateCoverImage({ prompt }),
  });
};