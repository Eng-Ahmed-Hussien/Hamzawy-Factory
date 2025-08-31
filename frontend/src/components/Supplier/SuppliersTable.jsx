import { useEffect, useState } from "react";
import axios from "axios";
import SupplierForm from "./SupplierForm";

function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchSuppliers = async () => {
    const res = await axios.get(
      "https://hamzawy-factory.vercel.app/api/suppliers"
    );
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📦 الموردين</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "إغلاق" : "➕ إضافة مورد"}
      </button>

      {showForm && <SupplierForm onSuccess={fetchSuppliers} />}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>الاسم</th>
            <th>الهاتف</th>
            <th>الإيميل</th>
            <th>العنوان</th>
            <th>الفواتير</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.phone}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>
                {s.invoices.length > 0
                  ? s.invoices.map((inv) => (
                      <div key={inv.id}>
                        {inv.amount} ج بتاريخ{" "}
                        {new Date(inv.date).toLocaleDateString()}
                      </div>
                    ))
                  : "لا يوجد"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierTable;
