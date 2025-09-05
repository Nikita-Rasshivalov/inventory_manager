import { Router } from "express";
import { guestController } from "../controllers/GuestController.ts";

const router = Router();

router.get("/latest", (req, res) => guestController.getLatest(req, res));
router.get("/top", (req, res) => guestController.getTop(req, res));

export default router;
