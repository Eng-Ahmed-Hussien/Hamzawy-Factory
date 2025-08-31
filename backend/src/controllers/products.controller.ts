import { Request, Response } from "express";
import prisma from "../config/db.js";

// ✅ جلب كل المنتجات
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "خطأ أثناء جلب المنتجات" });
  }
};

// ✅ إضافة أو تحديث منتج بالكود أو الاسم
export const createOrUpdateProduct = async (req: Request, res: Response) => {
  try {
    const { sku, name, incoming, outgoing, production, stock, costPrice, salePrice } = req.body;

    // نحدد الفئة (category) عن طريق الكود أو الاسم
    const category = await prisma.category.findFirst({
      where: { OR: [{ sku }, { name }] },
    });

    if (!category) {
      return res.status(400).json({ error: "⚠️ الكود أو الاسم غير موجود ضمن الفئات" });
    }

    // نبحث عن المنتج هل موجود قبل كده
    let product = await prisma.product.findFirst({
      where: { sku, categoryId: category.id },
    });

    if (product) {
      // تحديث الكميات
      product = await prisma.product.update({
        where: { id: product.id },
        data: {
          incoming: product.incoming + (incoming || 0),
          outgoing: product.outgoing + (outgoing || 0),
          production: product.production + (production || 0),
          stock: product.stock + (stock || 0),
          costPrice: costPrice ?? product.costPrice,
          salePrice: salePrice ?? product.salePrice,
        },
      });
    } else {
      // إنشاء منتج جديد
      product = await prisma.product.create({
        data: {
          sku: category.sku,
          name: category.name,
          categoryId: category.id,
          incoming: incoming || 0,
          outgoing: outgoing || 0,
          production: production || 0,
          stock: stock || 0,
          costPrice: costPrice || 0,
          salePrice: salePrice || 0,
        },
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "تعذر إنشاء/تحديث المنتج" });
  }
};
