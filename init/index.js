const path = require("path");

if (process.env.NODE_ENV !== "production") {
    // This creates a flawless absolute path directly to your root .env file
    require('dotenv').config({ path: path.join(__dirname, "../.env") });
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const dbURL = process.env.ATLASDB_URL;

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
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a5c1e45acf1254b3f5e1efd",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
