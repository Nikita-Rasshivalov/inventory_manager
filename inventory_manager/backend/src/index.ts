import "./config.ts";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";
import oauthRoutes from "./routes/oauthRoutes.ts";
import inventoryRoutes from "./routes/inventoryRoutes.ts";
import itemRoutes from "./routes/itemRoutes.ts";

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
app.use("/api/inventory", inventoryRoutes);
app.use("/api/inventory/:inventoryId/items", itemRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started ", PORT);
});
