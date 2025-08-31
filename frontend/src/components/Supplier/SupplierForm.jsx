import { useState } from "react";
import axios from "axios";

function SupplierForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/suppliers", form);
    setForm({ name: "", phone: "", email: "", address: "" });
    onSuccess();
  };

  return (
    <form className="card card-body mb-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control mb-2"
        name="name"
        placeholder="اسم المورد"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        className="form-control mb-2"
        name="phone"
        placeholder="رقم الهاتف"
        value={form.phone}
        onChange={handleChange}
      />
      <input
        type="email"
        className="form-control mb-2"
        name="email"
        placeholder="البريد الإلكتروني"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="text"
        className="form-control mb-2"
        name="address"
        placeholder="العنوان"
        value={form.address}
        onChange={handleChange}
      />
      <button className="btn btn-success">حفظ</button>
    </form>
  );
}

export default SupplierForm;
