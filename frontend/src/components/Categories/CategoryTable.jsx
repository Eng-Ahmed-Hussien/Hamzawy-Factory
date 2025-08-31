const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-center">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border p-2">الكود</th>
            <th className="border p-2">الاسم</th>
            <th className="border p-2">الحد الأدنى</th>
            <th className="border p-2">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border p-2">{c.sku}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2 text-red-600">{c.minQuantity}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => onEdit(c)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  تعديل
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CategoryTable;
