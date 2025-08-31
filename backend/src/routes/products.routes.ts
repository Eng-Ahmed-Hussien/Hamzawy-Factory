import { Router } from "express";
import {
  getProducts,
  createOrUpdateProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getProducts);
router.post("/", createOrUpdateProduct);

export default router;
