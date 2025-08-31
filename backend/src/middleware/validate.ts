import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";


export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
const toValidate = { body: req.body, params: req.params, query: req.query };
const result = schema.safeParse(toValidate);
if (!result.success) {
return res.status(400).json({ errors: result.error.flatten() });
}
next();
};