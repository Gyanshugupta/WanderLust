const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.postRoute = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("New Review Saved!!");
    req.flash('success','New Review Added!!');
    res.redirect(`/listings/${id}`);
  };

module.exports.deleteRoute = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let result = await Review.findByIdAndDelete(reviewId);
    console.log(result);
    req.flash('success','Review Deleted!!');
    res.redirect(`/listings/${id}`);
  };

