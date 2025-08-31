// components/LoginForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import RoleSelector from "./RoleSelector";

const LoginForm = ({ onSuccess }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "خطأ");
        return;
      }
      // تحقق أن المستخدم هو admin إذا اختار ذلك
      if (asAdmin && data.user.role !== "ADMIN") {
        setErr("هذا الحساب ليس له صلاحية مدير");
        return;
      }
      login({ token: data.token, user: data.user });
      onSuccess && onSuccess(data.user);
    } catch (e) {
      setErr("خطأ في الاتصال", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="mb-3">
        <label className="form-label">البريد الإلكتروني</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">كلمة المرور</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <RoleSelector asAdmin={asAdmin} setAsAdmin={setAsAdmin} />

      <button
        className="btn btn-gradient w-100"
        disabled={loading}
        type="submit"
      >
        {loading ? "جاري..." : "تسجيل الدخول"}
      </button>
    </form>
  );
};

export default LoginForm;
