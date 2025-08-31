import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: { invoices: true },
    });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(id) },
      include: { invoices: true },
    });
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch supplier" });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  const { name, phone, email, address } = req.body;
  try {
    const newSupplier = await prisma.supplier.create({
      data: { name, phone, email, address },
    });
    res.status(201).json(newSupplier);
  } catch (err) {
    res.status(500).json({ error: "Failed to create supplier" });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;
  try {
    const updated = await prisma.supplier.update({
      where: { id: Number(id) },
      data: { name, phone, email, address },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update supplier" });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.supplier.delete({ where: { id: Number(id) } });
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete supplier" });
  }
};
