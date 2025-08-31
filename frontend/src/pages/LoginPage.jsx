// src/pages/LoginPage.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * LoginPage:
 * - يستدعي POST /api/auth/login
 * - يستدعي login({ token, user }) من الـ context
 * - يعيد توجيه المستخدم بناءً على دوره (admin -> /dashboard, else -> /user)
 * - يدعم خيار "أريد تسجيل الدخول كمدير" كخيار واجهة فقط (التحقق من الخادم)
 */

const LoginPage = () => {
  const {
    login,
    user: currentUser,
    loading: authLoading,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  // local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [loading, setLoading] = useState(false); // لزر الصفحة فقط
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // إذا المستخدم مسجّل بالفعل، أعِده مباشرةً لصفحته
  useEffect(() => {
    if (!authLoading && currentUser) {
      if (currentUser.isAdmin) navigate("/dashboard", { replace: true });
      else navigate("/user", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, currentUser]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "حدث خطأ أثناء تسجيل الدخول");
        setLoading(false);
        return;
      }

      // إذا اختار المستخدم الواجهة "كمدير" فتأكد من دور الجواب
      if (asAdmin && data.user?.role !== "ADMIN") {
        setError("هذا الحساب لا يمتلك صلاحية مدير");
        setLoading(false);
        return;
      }

      // استدعاء login من الـ context
      // (المزود في AuthProvider سيتحقق لاحقًا من /api/auth/me إن احتاج)
      login({ token: data.token, user: data.user });

      // تحويل فوري حسب الدور
      if (data.user?.isAdmin) navigate("/dashboard", { replace: true });
      else navigate("/user", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "فشل الاتصال بالخادم. تأكد من تشغيل الـ backend أو إعداد proxy."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: 440, width: "100%" }}
      >
        <h3 className="mb-3 text-center">تسجيل الدخول</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              aria-required="true"
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              كلمة المرور
            </label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                aria-required="true"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "عرض كلمة المرور"
                }
              >
                {showPassword ? "إخفاء" : "عرض"}
              </button>
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              id="asAdmin"
              className="form-check-input"
              type="checkbox"
              checked={asAdmin}
              onChange={() => setAsAdmin((s) => !s)}
            />
            <label className="form-check-label" htmlFor="asAdmin">
              أريد تسجيل الدخول كمدير (التحقق يتم من الخادم)
            </label>
          </div>

          <button
            className="btn btn-primary w-100"
            disabled={loading || authLoading}
            type="submit"
            aria-busy={loading || authLoading}
          >
            {loading || authLoading ? "جارٍ..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <small className="text-muted">
            إنشاء حساب جديد يتم عبر المدير فقط.
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
