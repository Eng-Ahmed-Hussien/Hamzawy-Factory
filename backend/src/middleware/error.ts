import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";


export function notFound(req: Request, res: Response) {
res.status(404).json({ success: false, message: "Not Found" });
}


export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
const status = err instanceof ApiError ? err.statusCode : 500;
const message = err.message || "Internal Server Error";
if (process.env.NODE_ENV !== "test") console.error(err);
res.status(status).json({ success: false, message });
}