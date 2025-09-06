import { Request, Response } from "express";
import { UserService } from "../services/UserService.ts";
import { BaseController } from "./BaseController.ts";
import { v2 as cloudinary } from "cloudinary";

const userService = new UserService();

export class UserController extends BaseController {
  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const search = req.query.q as string;
      return await userService.getAll(search);
    });

  uploadProfilePhoto = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      if (!user) throw new Error("Unauthorized");
      if (!req.file) throw new Error("No file uploaded");

      const uploadToCloudinary = (buffer: Buffer) =>
        new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_photos", resource_type: "image" },
            (error, result) => {
              if (error || !result) reject(error || new Error("Upload failed"));
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

      const result = await uploadToCloudinary(req.file.buffer);

      const updatedUser = await userService.updateProfilePhoto(
        user.userId,
        result.secure_url
      );

      return updatedUser;
    });

  getById = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) throw new Error("Invalid user ID");
      const user = await userService.getById(userId);
      if (!user) throw new Error("User not found");
      return user;
    });
}
