// src/routes/auth.ts
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, requireAdmin } from "../middleware/auth";

const prisma = new PrismaClient();
const router = express.Router();
const SECRET = process.env.JWT_SECRET || "secretkey";

// Login (عام)
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ message: "email and password required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "بيانات غير صحيحة" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "بيانات غير صحيحة" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "8h" });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// Register (مقتصر على المديرين فقط)
router.post("/register", authMiddleware, requireAdmin, async (req, res) => {
  const { name, email, password, role } = req.body as { name?: string; email?: string; password?: string; role?: "USER" | "ADMIN" };
  if (!email || !password) return res.status(400).json({ message: "email and password required" });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "البريد مستخدم مسبقاً" });

    const hashed = await bcrypt.hash(password, 10);
    const isAdmin = role === "ADMIN";
    const user = await prisma.user.create({
      data: {
        name: name ?? null,
        email,
        password: hashed,
        role: role ?? "USER",
        isAdmin,
      },
    });

    return res.json({ message: "تم إنشاء المستخدم", user: { id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// جلب المستخدم الحالي
router.get("/me", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

// جلب كل المستخدمين (محمي للادمن)
router.get("/users", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isAdmin: true, createdAt: true } });
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "خطأ في الخادم" });
  }
});

export default router;
