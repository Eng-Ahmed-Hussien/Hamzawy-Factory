import Swal from "sweetalert2";

const ProductsTable = ({ products, isAdmin, onEdit, onDelete }) => {
  const handleWarning = (warning) => {
    if (warning) {
      Swal.fire({
        title: "تنبيه",
        text: warning,
        icon: "warning",
        confirmButtonText: "تم",
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-center">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border p-2">الكود</th>
            <th className="border p-2">الاسم</th>
            <th className="border p-2">الوارد</th>
            <th className="border p-2">الصادر</th>
            <th className="border p-2">التصنيع</th>
            <th className="border p-2">المخزن</th>
            <th className="border p-2">سعر الوحدة</th>
            <th className="border p-2">سعر البيع</th>
            {isAdmin && (
              <>
                <th className="border p-2">إجمالي الشراء</th>
                <th className="border p-2">إجمالي البيع</th>
              </>
            )}
            <th className="border p-2">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const totalStock = p.production + p.stock;
            const totalPurchase = p.costPrice * totalStock;
            const totalSale = p.salePrice * totalStock;
            return (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-2">{p.sku}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.incoming}</td>
                <td className="border p-2">{p.outgoing}</td>
                <td className="border p-2">{p.production}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2">{p.costPrice} ج.م</td>
                <td className="border p-2">{p.salePrice} ج.م</td>
                {isAdmin && (
                  <>
                    <td className="border p-2 text-green-600">
                      {totalPurchase} ج.م
                    </td>
                    <td className="border p-2 text-blue-600">
                      {totalSale} ج.م
                    </td>
                  </>
                )}
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    حذف
                  </button>
                  {p.warning && (
                    <button
                      onClick={() => handleWarning(p.warning)}
                      className="bg-orange-400 text-white px-2 py-1 rounded"
                    >
                      تنبيه
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
