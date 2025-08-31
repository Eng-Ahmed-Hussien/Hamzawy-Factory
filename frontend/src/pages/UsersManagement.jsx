// src/pages/UsersManagement.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const UsersManagement = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // فورم إضافة / تعديل مستخدم
  const [editingUser, setEditingUser] = useState(null); // لو فيه مستخدم بيتعدل
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // تحميل المستخدمين
  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // تغيير بيانات الفورم
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // إضافة أو تعديل مستخدم
  const saveUser = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      const url = editingUser
        ? `/api/auth/users/${editingUser.id}`
        : "/api/auth/register";

      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "فشل العملية");
      } else {
        fetchUsers();
        setFormData({ name: "", email: "", password: "", role: "USER" });
        setEditingUser(null);
      }
    } catch (err) {
      console.error(err);
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setProcessing(false);
    }
  };

  // حذف مستخدم
  const deleteUser = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المستخدم؟")) return;
    try {
      await fetch(`/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // استرجاع مستخدم (لو backend عامل soft delete)
  const restoreUser = async (id) => {
    try {
      await fetch(`/api/auth/users/${id}/restore`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // تجهيز التعديل
  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // ما نعرضش الباسورد
      role: user.role || "USER",
    });
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">إدارة المستخدمين</h3>

      {/* فورم إضافة / تعديل */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">
          {editingUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
        </h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={saveUser} className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="الاسم"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              className="form-control"
              placeholder="البريد الإلكتروني"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="password"
              className="form-control"
              placeholder="كلمة المرور"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!editingUser} // مطلوب فقط عند الإضافة
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">مستخدم</option>
              <option value="ADMIN">مدير</option>
            </select>
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-success w-100"
              type="submit"
              disabled={processing}
            >
              {processing ? "جارٍ..." : editingUser ? "حفظ" : "إضافة"}
            </button>
          </div>
        </form>
      </div>

      {/* قائمة المستخدمين */}
      {loading ? (
        <p>جارٍ التحميل...</p>
      ) : users.length === 0 ? (
        <p>لا يوجد مستخدمين</p>
      ) : (
        <ul className="list-group">
          {users.map((u) => (
            <li
              key={u.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{u.email}</strong> - <small>{u.name}</small>
              </div>
              <div>
                {/* شارة الدور */}

                {u.role === "ADMIN" ? (
                  <span className="btn btn-sm bg-warning text-dark me-2">
                    مدير
                  </span>
                ) : (
                  <span className="btn btn-sm bg-secondary me-2 text-white">
                    مستخدم
                  </span>
                )}

                {/* أزرار العمليات */}
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => startEdit(u)}
                >
                  تعديل
                </button>
                {u.deleted ? (
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => restoreUser(u.id)}
                  >
                    استرجاع
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteUser(u.id)}
                  >
                    حذف
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersManagement;
