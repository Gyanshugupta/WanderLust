const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const {
  indexRoute,
  newRoute,
  showRoute,
  editRoute,
  updateRoute,
  deleteRoute,
  createRoute,
} = require("../controller/listings");
const { create } = require("../models/review");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

//index,create route
router
  .route("/")
  .get(wrapAsync(indexRoute))
  .post(isLoggedIn, validateListing,upload.single("listing[image]"), wrapAsync(createRoute));

// new route

router.get("/new", isLoggedIn, newRoute);
//show and update route and delete route
router
  .route("/:id")
  .get(wrapAsync(showRoute))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(updateRoute))
  .post(isLoggedIn, isOwner, wrapAsync(deleteRoute));

// edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(editRoute),
);

module.exports = router;
