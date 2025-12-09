import { authService } from "./auth";

const API_URL = "http://localhost:8000/api/v1";

export interface UserProfile {
  email: string;
  _id?: string;
  created_at?: string;
  saved_toy_ids?: string[];
  child_age_range?: string;
  eco_goals?: string[];
  interests?: string[];
}

export interface UserUpdateData {
  child_age_range?: string;
  eco_goals?: string[];
  interests?: string[];
}

export const usersService = {
  async getProfile(): Promise<UserProfile> {
    const token = authService.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  async updateProfile(data: UserUpdateData): Promise<UserProfile> {
    const token = authService.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  },
};