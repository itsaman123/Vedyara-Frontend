import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { apiRequest } from "./apiCalls";

export type AdminVideo = {
  _id: string;
  title: string;
  description: string;
  ytId: string;
  videoSrc: string;
  thumbnail: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VideoPayload = {
  title: string;
  description?: string;
  ytId?: string;
  videoSrc?: string;
  thumbnail?: string;
  order?: number;
  isActive?: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export const getAdminVideos = () =>
  apiRequest<{ items: AdminVideo[]; pagination: Pagination }>(
    "/api/admin/videos",
    {},
    { limit: 100 },
  );

export const getAdminVideo = (id: string) =>
  apiRequest<{ video: AdminVideo }>(`/api/admin/videos/${id}`);

export const createAdminVideo = (payload: VideoPayload) =>
  apiRequest<{ video: AdminVideo }>("/api/admin/videos", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminVideo = ({ id, payload }: { id: string; payload: VideoPayload }) =>
  apiRequest<{ video: AdminVideo }>(`/api/admin/videos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminVideo = (id: string) =>
  apiRequest<{ videoId: string }>(`/api/admin/videos/${id}`, {
    method: "DELETE",
  });

export const getVideoCloudinarySignature = () =>
  apiRequest<{
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
  }>("/api/admin/uploads/video-cloudinary-signature", { method: "POST" });

export const uploadAdminVideoFile = async (file: File) => {
  const config = await getVideoCloudinarySignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", String(config.timestamp));
  formData.append("signature", config.signature);
  formData.append("folder", config.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/video/upload`,
    { method: "POST", body: formData },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Video upload failed");
  }

  return { url: data.secure_url as string, publicId: data.public_id as string };
};

export function useAdminVideos() {
  return useQuery({
    queryKey: ["admin", "videos"],
    queryFn: getAdminVideos,
  });
}

export function useAdminVideo(id: string | null) {
  return useQuery({
    queryKey: ["admin", "video", id],
    queryFn: () => getAdminVideo(id as string),
    enabled: Boolean(id),
  });
}

export function useSaveAdminVideo(
  options?: UseMutationOptions<{ video: AdminVideo }, Error, { id?: string; payload: VideoPayload }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? updateAdminVideo({ id, payload }) : createAdminVideo(payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useDeleteAdminVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminVideo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
    },
  });
}
