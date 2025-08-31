// src/context/AuthContext.jsx
import { createContext } from "react";

/**
 * AuthContext فقط قيمة (لا مكوّن) => يحل مشكلة Fast Refresh
 * الشكل الافتراضي للـ context value موجود هنا لمنع undefined عند الاستيراد.
 */
export const AuthContext = createContext({
  user: null, // { id, name, email, role, isAdmin, ... } أو null
  token: null, // JWT أو null
  login: () => {}, // login({ token, user })
  logout: () => {}, // logout()
  loading: false, // حالة التحقق من التوكن
  isAdmin: false, // boolean مساعد
  getAuthHeaders: () => ({}), // يعيد Authorization headers جاهزة
  refreshUser: () => {}, // يعيد جلب بيانات المستخدم من الخادم
});
