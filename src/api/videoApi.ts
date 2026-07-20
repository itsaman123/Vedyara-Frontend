import { useQuery } from "@tanstack/react-query";

import { API_BASE_URL } from "../config/environment";

export type Video = {
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

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const getVideos = async (): Promise<Video[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/videos`);
  const payload = (await response.json()) as ApiResponse<{ items: Video[] }>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch videos");
  }

  return payload.data.items;
};

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
  });
}
