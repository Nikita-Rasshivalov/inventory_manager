import "./config.ts";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";
import oauthRoutes from "./routes/oauthRoutes.ts";
import guestRoutes from "./routes/guestRoutes.ts";
import inventoryRoutes from "./routes/inventoryRoutes.ts";
import itemRoutes from "./routes/itemRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import fieldRoutes from "./routes/fieldRoutes.ts";
import categoryRoutes from "./routes/categoriesRouter.ts";
import tagRoutes from "./routes/tagsRouter.ts";
import salesforceRoutes from "./routes/salesforceRoutes.ts";
import registerSocketHandlers from "./sokets/index.ts";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/guest", guestRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", oauthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/inventory", fieldRoutes);
app.use("/api/salesforce", salesforceRoutes);
app.use("/api/inventory/:inventoryId/items", itemRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  },
});

io.on("connection", (socket) => {
  registerSocketHandlers(socket, io);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port", PORT);
});
