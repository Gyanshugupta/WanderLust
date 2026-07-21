if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
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
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/review");
const session = require("express-session");
const {MongoStore} = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require('./routes/user');
const { url } = require('inspector');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbURL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


store.on('error',(err) => {
  console.log("ERROR in MONGO SESSION STORE",err);
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  await mongoose.connect(dbURL);
}

app.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  }),
);

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use('/',userRouter);

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //   res.status(statusCode).send(message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


