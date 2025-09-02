import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { OAuthService } from "../services/authService/OAuthService.ts";

const oauthService = new OAuthService();

function getIp(req: any) {
  const xff = req.headers["x-forwarded-for"]?.toString();
  if (xff) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || req.ip;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      passReqToCallback: true,
    },
    async (req: any, _at, _rt, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          `google-${profile.id}@users.noreply.example.com`;
        const name = profile.displayName || profile.name?.givenName || "User";
        const providerUserId = profile.id;
        if (!email) return done(new Error("No email from Google"));
        const result = await oauthService.loginOrRegister(
          "google",
          providerUserId,
          email,
          name,
          getIp(req),
          req.headers["user-agent"]?.toString()
        );
        return done(null, result);
      } catch (e) {
        return done(e as any);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ["user:email"],
      passReqToCallback: true,
    },
    async (req: any, _at: any, _rt: any, profile: any, done: any) => {
      try {
        const email =
          (profile.emails && profile.emails[0]?.value) ||
          `${profile.username}@users.noreply.github.com`;
        const name = profile.displayName || profile.username || "User";
        const providerUserId = String(profile.id);
        const result = await oauthService.loginOrRegister(
          "github",
          providerUserId,
          email,
          name,
          getIp(req),
          req.headers["user-agent"]?.toString()
        );

        return done(null, result);
      } catch (e) {
        return done(e as any);
      }
    }
  )
);

export default passport;
