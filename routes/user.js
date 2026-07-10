const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {
  signupForm,
  signupRoute,
  loginForm,
  loginRoute,
  logoutRoute,
} = require("../controller/user");

//sign up
router.route("/signup")
.get(signupForm)
.post(wrapAsync(signupRoute));

// login
router
  .route("/login")
  .get(loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(loginRoute),
  );

// logout user route
router.get("/logout", logoutRoute);

module.exports = router;
