const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const listingSchema = require("./schema");
const Review = require("./models/review");
const { reviewSchema } = require("./schema");
const listings = require('./routes/listings');
const reviews = require('./routes/review');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get(
  "/",
  wrapAsync(async (req, res) => {
    res.send("Hi, I am root");
  }),
);

app.use("/listings",listings);
app.use("/reviews",reviews);


app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //   res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("server is listening at port 3000");
});
