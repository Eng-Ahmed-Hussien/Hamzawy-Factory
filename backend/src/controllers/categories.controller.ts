import { Request, Response } from "express";
import prisma from "../config/db.js";

// ✅ جلب كل الفئات مع الكود والاسم
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: false },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ أثناء جلب الفئات" });
  }
};

// ✅ إضافة فئة جديدة
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { sku, name, minQuantity } = req.body;

    // تحقق من التكرار
    const existing = await prisma.category.findFirst({
      where: { OR: [{ sku }, { name }] },
    });
    if (existing) {
      return res.status(400).json({ error: "⚠️ الكود أو الاسم مستخدم بالفعل" });
    }

    const category = await prisma.category.create({
      data: { sku, name, minQuantity },
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "تعذر إنشاء الفئة" });
  }
};

// ✅ تعديل فئة
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sku, name, minQuantity } = req.body;

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { sku, name, minQuantity },
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "تعذر تعديل الفئة" });
  }
};

// ✅ حذف فئة
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: Number(id) } });
    res.json({ message: "تم الحذف بنجاح" });
  } catch (err) {
    res.status(500).json({ error: "تعذر حذف الفئة" });
  }
};
