import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();

app.use(cors({
  origin: "https://el-hamzawy-factory.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.options("*", cors({
  origin: "https://el-hamzawy-factory.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

export default app;
