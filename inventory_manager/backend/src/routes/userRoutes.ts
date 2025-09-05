import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { UserController } from "../controllers/UserController.ts";
import { upload } from "../multer.ts";

const router = Router();
const controller = new UserController();

router.get("/", authMiddleware, controller.getAll);

router.get("/:userId", controller.getById);

router.post("/theme", authMiddleware, controller.updateTheme);

router.post(
  "/upload-profile-photo",
  authMiddleware,
  upload.single("file"),
  controller.uploadProfilePhoto
);

export default router;
