import express from "express";
import passport from "passport";
import { sendMessage } from "../rocket/bot";
import userController from "../controllers/user";
import authController from "../controllers/auth";
const router = express.Router();
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  let user = await userController.findBy({ _id: id });
  let avatar = user.avatar;
  if (!user.avatar) {
    avatar = `${process.env.ROCKET_HOST}/api/v1/users.getAvatar?userId=${
      user.rocketId
    }`;
  }
  user = {
    name: user.name,
    avatar
  };
  done(null, user);
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_KEY,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: process.env.LINKEDIN_URL_CALLBACK,
      scope: ["r_emailaddress", "r_basicprofile"]
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(async function() {
        let user;
        try {
          user = await userController.findBy({ linkedinId: profile.id });
          return done(null, user);
        } catch (error) {
          console.log("error", error);
          await sendMessage(
            `Esse nobre cavaleiro não conseguiu logar no santuário: \nID: ${
              profile.id
            } \nDISPLAYNAME: ${profile.displayName} \nEMAIL: ${
              profile._json.emailAddress
            } \n FOTO: ${profile._json.pictureUrl} \n PROFILE: ${
              profile._json.publicProfileUrl
            } `,
            "projeto-atena"
          );
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, profile);
      });
    }
  )
);

router.get("/linkedin", passport.authenticate("linkedin", { state: "atena" }));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/",
    failureRedirect: "/auth/error"
  })
);

router.get("/myuser", async (req, res) => {
  let user = await userController.findBy({ rocketId: "H9kcNkWwXF92XxtTF" });
  user.linkedinId = "hQXxqdaqVD";
  await user.save();

  res.send("Update user");
});

router.get("/error", authController.error);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default router;
