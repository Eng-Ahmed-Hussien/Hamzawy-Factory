// src/pages/UserPage.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>المستخدم العادي</h2>
        <div>
          <span className="me-2">{user?.name || user?.email}</span>
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

      <div className="card p-3">
        <p>هذا المحتوى مرئي للمستخدمين المسجلين فقط.</p>
      </div>
    </div>
  );
};

export default UserPage;
