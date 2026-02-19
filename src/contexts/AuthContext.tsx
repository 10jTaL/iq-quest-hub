import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteConfig, RoleUser, UserRole } from "@/types/quiz";

interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    // Demo: password is "quizai" for everyone
    if (password !== "quizai") return false;

    // Check if user has a specific role in siteConfig
    let role: UserRole = "user";
    let name = email.split("@")[0];
    try {
      const stored = localStorage.getItem("siteConfig");
      if (stored) {
        const config: SiteConfig = JSON.parse(stored);
        const found = config.roleUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (found) {
          role = found.role;
          name = found.name;
        }
      }
    } catch {}

    setUser({ email, name, role });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
