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
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  (req: any, res) => {
    const { accessToken, refreshToken, user } = req.user;
    const frontendUrl = process.env.FRONTEND_URL;
    const redirectUrl =
      `${frontendUrl}/success` +
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
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  (req: any, res) => {
    const { accessToken, refreshToken, user } = req.user;
    const frontendUrl = process.env.FRONTEND_URL;
    const redirectUrl =
      `${frontendUrl}/success` +
      `?accessToken=${accessToken}` +
      `&refreshToken=${refreshToken}` +
      `&name=${encodeURIComponent(user.name)}`;

    res.redirect(redirectUrl);
  }
);
export default router;
