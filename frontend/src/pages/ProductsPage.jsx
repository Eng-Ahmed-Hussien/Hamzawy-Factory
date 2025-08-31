import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../components/products/ProductForm";
import ProductsTable from "../components/products/ProductsTable";

export default function ProductsPage({ user }) {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  const addProduct = async (prod) => {
    if (editProduct) {
      await axios.put(`/api/products/${editProduct.id}`, prod);
      setEditProduct(null);
    } else {
      await axios.post("/api/products", prod);
    }
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-6" dir="rtl">
      <ProductForm onAdd={addProduct} suggestions={products} />
      <ProductsTable
        products={products}
        isAdmin={user?.role === "admin"}
        onEdit={setEditProduct}
        onDelete={deleteProduct}
      />
    </div>
  );
}
