// components/RegisterForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RegisterForm = ({ onCreated }) => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "err", text: data.message });
        return;
      }
      setMsg({ type: "ok", text: "تم إنشاء المستخدم" });
      setForm({ name: "", email: "", password: "", role: "USER" });
      onCreated && onCreated(data.user);
    } catch (e) {
      setMsg({ type: "err", text: "خطأ في الخادم", details: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      {msg && (
        <div
          className={`alert ${
            msg.type === "ok" ? "alert-success" : "alert-danger"
          }`}
        >
          {msg.text}
        </div>
      )}
      <div className="mb-2">
        <input
          name="name"
          className="form-control"
          placeholder="الاسم"
          value={form.name}
          onChange={handle}
          required
        />
      </div>
      <div className="mb-2">
        <input
          name="email"
          type="email"
          className="form-control"
          placeholder="البريد"
          value={form.email}
          onChange={handle}
          required
        />
      </div>
      <div className="mb-2">
        <input
          name="password"
          type="password"
          className="form-control"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={handle}
          required
        />
      </div>
      <div className="mb-3">
        <select
          name="role"
          value={form.role}
          onChange={handle}
          className="form-select"
        >
          <option value="USER">مستخدم</option>
          <option value="ADMIN">مدير</option>
        </select>
      </div>
      <button
        className="btn btn-gradient w-100"
        type="submit"
        disabled={loading}
      >
        {loading ? "جاري الإنشاء..." : "إنشاء مستخدم"}
      </button>
    </form>
  );
};

export default RegisterForm;
