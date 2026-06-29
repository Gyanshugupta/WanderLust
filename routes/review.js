const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}; 

// review post
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("New Review Saved!!");
    res.redirect(`/listings/${id}`);
  }),
);

//review Delete
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let result = await Review.findByIdAndDelete(reviewId);
    console.log(result);
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;