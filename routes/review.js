const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const {validateReview, isLoggedIn, isOwner, isReviewAuthor} = require('../middleware');
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { postRoute, deleteRoute } = require('../controller/reviews');



// review post
router.post(
  "/",
  validateReview,isLoggedIn,
  wrapAsync(postRoute),
);

//review Delete
router.delete(
  "/:reviewId",isLoggedIn,isReviewAuthor,
  wrapAsync(deleteRoute),
);

module.exports = router;