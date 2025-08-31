// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>داشبورد المدير</h2>
        <div>
          <span className="me-2">مرحباً، {user?.name || user?.email}</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-3">
            <h5>إنشاء مستخدم جديد</h5>
            <p>
              استخدم صفحة إدارة المستخدمين لإضافة حسابات (خادم يتحقق من
              الصلاحية).
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/users")}
            >
              اذهب لإدارة المستخدمين
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h5>معلومات سريعة</h5>
            <p>هنا يمكن أن تضيف إحصاءات، تقارير أو روابط مفيدة.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
