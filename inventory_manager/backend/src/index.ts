import "./config.ts";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";
import oauthRoutes from "./routes/oauthRoutes.ts";

const app = express();
const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth", oauthRoutes);

app.listen(3001, "0.0.0.0", () => {
  console.log("Server started ", process.env.PORT);
});
