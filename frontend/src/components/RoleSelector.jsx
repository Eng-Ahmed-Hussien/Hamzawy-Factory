// components/RoleSelector.jsx
import React from "react";

const RoleSelector = ({ asAdmin, setAsAdmin }) => {
  return (
    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        checked={asAdmin}
        onChange={(e) => setAsAdmin(e.target.checked)}
        id="asAdmin"
      />
      <label className="form-check-label" htmlFor="asAdmin">
        تسجيل كـ مدير (فقط إن كان حسابك مدير)
      </label>
    </div>
  );
};

export default RoleSelector;
