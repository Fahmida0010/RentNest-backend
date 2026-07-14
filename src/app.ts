import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./routes";
import globalError from "./middleware/globalError";
dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api", router);

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🚀 RentNest API is running...",
  });
});



app.use(globalError);

export default app;
