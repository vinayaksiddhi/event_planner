import { createContext, useEffect, useState } from "react";
import supabase from "../services/supabase";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // 🔥 Get current session
  useEffect(() => {
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 Fetch session + role
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUser(session.user);
      fetchUserRole(session.user.id);
    } else {
      setUser(null);
      setRole(null);
    }
  };

  // 🔥 Fetch role from users table
  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Role fetch error:", error);
    } else {
      setRole(data.role);
    }
  };

  // 🔥 REGISTER (with role)
  const register = async (email, password, roleType) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user.id;

    // 🔥 Insert into users table
    await supabase.from("users").insert([
      {
        id: userId,
        email,
        role: roleType, // "user" or "admin"
      },
    ]);

    alert("Registered successfully");
  };

  // 🔥 LOGIN
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }
  };

  // 🔥 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, role, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}