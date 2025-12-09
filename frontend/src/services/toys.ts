import { authService } from "./auth";

export interface Toy {
  _id: string;
  name: string;
  description: string;
  image_url: string;
  certification_ids: string[];
  created_at: string;
  brand?: string;
  price?: number;
  currency?: string;
  buy_link?: string;
  materials?: string[];
  age_range?: string;
  category?: string;
  match_score?: number;
  match_reason?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export interface ToyFilters {
  age_range?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  recommend?: boolean;
}

export const fetchToys = async (filters?: ToyFilters): Promise<Toy[]> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.age_range && filters.age_range !== "all") params.append("age_range", filters.age_range);
    if (filters.category && filters.category !== "all") params.append("category", filters.category);
    if (filters.min_price) params.append("min_price", filters.min_price.toString());
    if (filters.max_price) params.append("max_price", filters.max_price.toString());
    if (filters.recommend) params.append("recommend", "true");
  }

  const queryString = params.toString();
  const url = `${API_URL}/toys${queryString ? `?${queryString}` : ""}`;

  // Add auth token if available to enable personalization
  const token = authService.getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error("Failed to fetch toys");
  }
  return response.json();
};

export const getToyById = async (id: string): Promise<Toy> => {
  const response = await fetch(`${API_URL}/toys/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch toy");
  }
  return response.json();
};

export const fetchSavedToys = async (): Promise<Toy[]> => {
  const token = authService.getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/users/me/saved-toys`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch saved toys");
  }
  return response.json();
};

export const saveToy = async (toyId: string): Promise<void> => {
  const token = authService.getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/users/me/saved-toys/${toyId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to save toy");
  }
};

export const unsaveToy = async (toyId: string): Promise<void> => {
  const token = authService.getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/users/me/saved-toys/${toyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to unsave toy");
  }
};