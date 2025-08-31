import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CategoryForm from "../components/Categories/CategoryForm";
import CategoryTable from "../components/Categories/CategoryTable";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    const res = await axios.get("/api/categories");
    setCategories(res.data);
  };

  const addCategory = async (cat) => {
    if (editCategory) {
      await axios.put(`/api/categories/${editCategory.id}`, cat);
      setEditCategory(null);
    } else {
      await axios.post("/api/categories", cat);
    }
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    const confirm = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف الفئة بشكل نهائي",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-6" dir="rtl">
      <CategoryForm onAdd={addCategory} />
      <CategoryTable
        categories={categories}
        onEdit={setEditCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}
