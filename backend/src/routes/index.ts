// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth.routes";
import productsRoutes from "./products.routes";
import categoriesRoutes from "./categories.routes";
import suppliersRoute from "./suppliers.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/suppliers", suppliersRoute);

export default router;