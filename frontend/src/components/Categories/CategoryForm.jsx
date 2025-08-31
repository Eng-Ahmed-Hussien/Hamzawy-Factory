import { useState } from "react";
import Swal from "sweetalert2";

export default function CategoryForm({ onAdd }) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [minQuantity, setMinQuantity] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sku.trim() || !name.trim()) {
      Swal.fire("تحذير", "يجب إدخال الكود والاسم", "warning");
      return;
    }

    try {
      await onAdd({ sku, name, minQuantity: Number(minQuantity) });
      setSku("");
      setName("");
      setMinQuantity(0);
    } catch (err) {
      Swal.fire(
        "خطأ",
        err.response?.data?.error || "تعذر إضافة الفئة",
        "error"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3"
      dir="rtl"
    >
      <h2 className="text-lg font-bold mb-2">إضافة فئة جديدة</h2>

      <input
        type="text"
        placeholder="كود المنتج"
        className="border p-2 rounded"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />

      <input
        type="text"
        placeholder="اسم المنتج"
        className="border p-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="الحد الأدنى"
        className="border p-2 rounded"
        value={minQuantity}
        onChange={(e) => setMinQuantity(e.target.value)}
      />

      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        إضافة
      </button>
    </form>
  );
}
