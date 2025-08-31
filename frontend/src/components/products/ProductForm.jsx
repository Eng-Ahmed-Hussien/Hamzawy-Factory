import { useState } from "react";
import Swal from "sweetalert2";

export default function ProductForm({ onAdd, suggestions }) {
  const [skuOrName, setSkuOrName] = useState("");
  const [incoming, setIncoming] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skuOrName.trim()) {
      Swal.fire("تحذير", "يجب إدخال الكود أو الاسم", "warning");
      return;
    }

    try {
      await onAdd({
        sku: skuOrName,
        name: skuOrName,
        incoming: Number(incoming),
        costPrice: Number(costPrice),
        salePrice: Number(salePrice),
      });
      setSkuOrName("");
      setIncoming(0);
      setCostPrice(0);
      setSalePrice(0);
    } catch (err) {
      Swal.fire(
        "خطأ",
        err.response?.data?.error || "تعذر إضافة المنتج",
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
      <h2 className="text-lg font-bold mb-2">إضافة / تعديل منتج</h2>

      {/* كود/اسم المنتج مع Autocomplete */}
      <div className="flex flex-col">
        <label className="font-semibold">الكود / الاسم</label>
        <input
          list="products-list"
          type="text"
          placeholder="ادخل الكود أو الاسم"
          className="border p-2 rounded"
          value={skuOrName}
          onChange={(e) => setSkuOrName(e.target.value)}
        />
        <datalist id="products-list">
          {suggestions.map((s) => (
            <option key={s.id} value={s.sku || s.name} />
          ))}
        </datalist>
      </div>

      <div className="flex flex-col">
        <label className="font-semibold">الوارد (الكمية)</label>
        <input
          type="number"
          placeholder="عدد المنتجات الواردة"
          className="border p-2 rounded"
          value={incoming}
          onChange={(e) => setIncoming(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="font-semibold">سعر الشراء للوحدة</label>
        <input
          type="number"
          placeholder="أدخل سعر الشراء"
          className="border p-2 rounded"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="font-semibold">سعر البيع للوحدة</label>
        <input
          type="number"
          placeholder="أدخل سعر البيع"
          className="border p-2 rounded"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        حفظ
      </button>
    </form>
  );
}
