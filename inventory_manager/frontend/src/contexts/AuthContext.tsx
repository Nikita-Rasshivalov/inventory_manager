import { createContext } from "react";
import { User } from "../models/models";

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
