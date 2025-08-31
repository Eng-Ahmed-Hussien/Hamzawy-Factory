// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

/**
 * AuthProvider: يدير token و user و يوفر دوال login/logout و وظائف مساعدة.
 * - يتأكد من صحة التوكن عبر /api/auth/me عند التحميل (إن وُجد token في localStorage)
 * - login يتوقع كائن { token, user } (الخادم يجب أن يرجع user عند تسجيل الدخول)
 * - getAuthHeaders مفيد لإضافة Authorization في fetch
 */

const LOCAL_TOKEN_KEY = "token";
const LOCAL_USER_KEY = "user";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem(LOCAL_TOKEN_KEY)
  );
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!!token); // اذا هناك توكن -> نتحقق منه

  // حفظ/حذف التوكن محلياً
  const saveToken = useCallback((t) => {
    if (t) {
      localStorage.setItem(LOCAL_TOKEN_KEY, t);
      setToken(t);
    } else {
      localStorage.removeItem(LOCAL_TOKEN_KEY);
      setToken(null);
    }
  }, []);

  const saveUser = useCallback((u) => {
    if (u) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      setUser(u);
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
    }
  }, []);

  // تسجيل الخروج
  const logout = useCallback(() => {
    saveToken(null);
    saveUser(null);
  }, [saveToken, saveUser]);

  // جلب معلومات المستخدم الحقيقية من الخادم (/api/auth/me)
  const fetchMe = useCallback(
    async (t) => {
      if (!t) return null;
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (!res.ok) {
          // توكن غير صالح -> logout
          logout();
          return null;
        }
        const data = await res.json();
        // الخادم يجب أن يرجع { user }
        if (data?.user) {
          saveUser(data.user);
          return data.user;
        }
        // إن لم يأتِ مستخدم -> خروج
        logout();
        return null;
      } catch (err) {
        console.error("fetchMe error:", err);
        logout();
        return null;
      } finally {
        setLoading(false);
      }
    },
    [logout, saveUser]
  );

  // عند تغيّر التوكن، نتحقق منه عبر fetchMe
  useEffect(() => {
    if (token) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchMe]);

  // login: يستقبل { token, user? } — غالباً الخادم يرجع user مع token
  const login = useCallback(
    ({ token: newToken, user: newUser }) => {
      if (!newToken) throw new Error("login requires token");
      saveToken(newToken);
      if (newUser) {
        saveUser(newUser);
      } else {
        // لو الخادم لم يُرجع user نطلبه
        fetchMe(newToken).catch(() => {});
      }
    },
    [saveToken, saveUser, fetchMe]
  );

  const getAuthHeaders = useCallback(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const refreshUser = useCallback(() => {
    return fetchMe(token);
  }, [fetchMe, token]);

  const isAdmin = !!user?.isAdmin || user?.role === "ADMIN";

  const contextValue = {
    user,
    token,
    login,
    logout,
    loading,
    isAdmin,
    getAuthHeaders,
    refreshUser,
    setUser, // مفيد لتحديث بيانات المستخدم محلياً بعد تعديل ملف التعريف
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
