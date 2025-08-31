import dotenv from "dotenv";
dotenv.config();


function required(name: string, fallback?: string) {
const v = process.env[name] || fallback;
if (!v) throw new Error(`Missing env var ${name}`);
return v;
}


export const env = {
NODE_ENV: process.env.NODE_ENV || "development",
PORT: Number(process.env.PORT || 4000),
JWT_SECRET: required("JWT_SECRET"),
JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};