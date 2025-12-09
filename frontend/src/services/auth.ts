import { z } from "zod";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const API_URL = `${API_BASE_URL}/auth`;

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

export interface User {
  email: string;
  _id?: string;
  created_at?: string;
  saved_toy_ids?: string[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async signup(data: SignupInput): Promise<User> {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Signup failed");
    }

    return response.json();
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem("token");
    window.location.reload();
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};