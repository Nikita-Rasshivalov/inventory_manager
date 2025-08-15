import { Router } from "express";
import passport from "../auth/passport.ts";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/failure",
  }),
  (req: any, res) => {
    const { accessToken, refreshToken, user } = req.user;
    const frontendUrl = process.env.FRONTEND_URL;
    const redirectUrl =
      `${frontendUrl}/auth/success` +
      `?accessToken=${accessToken}` +
      `&refreshToken=${refreshToken}` +
      `&name=${encodeURIComponent(user.name)}`;

    res.redirect(redirectUrl);
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/api/auth/failure",
  }),
  (req: any, res) => {
    const { accessToken, refreshToken, user } = req.user;
    const frontendUrl = process.env.FRONTEND_URL;
    const redirectUrl =
      `${frontendUrl}/auth/success` +
      `?accessToken=${accessToken}` +
      `&refreshToken=${refreshToken}` +
      `&name=${encodeURIComponent(user.name)}`;

    res.redirect(redirectUrl);
  }
);

router.get("/failure", (_req, res) => {
  res.status(401).json({ message: "OAuth login failed" });
});

export default router;
