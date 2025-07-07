import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  username: string;
  role: "student" | "educator" | ""; // "" = default when not logged in
  login: (username: string, role: "student" | "educator") => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: "",
      role: "",
      login: (username, role) => set({ isAuthenticated: true, username, role }),
      logout: () => set({ isAuthenticated: false, username: "", role: "" }),
    }),
    {
      name: "auth-storage", // Key in localStorage
    }
  )
);
