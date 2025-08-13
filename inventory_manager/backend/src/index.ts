import "./config.ts";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";

const app = express();
const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);

app.listen(3001, "0.0.0.0", () => {
  console.log("Server started ", process.env.PORT);
});
