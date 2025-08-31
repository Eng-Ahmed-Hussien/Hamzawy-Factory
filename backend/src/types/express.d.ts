// src/types/express.d.ts
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: Role;
        isAdmin: boolean;
      };
    }
  }
}
export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price?: number;
  categoryId: number;
  category?: Category;
}
