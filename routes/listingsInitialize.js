const auth = require("../middleware/auth");
const express = require("express");
const firebaseStorage = require("../store/services/firebaseStorage");
const router = express.Router();
const listingStore = require("../store/listings");
const userStore = require("../store/users");

router.get("/", auth, async (req, res) => {
  try {
    userStore.addSamples();
    const numListings = listingStore.addSamples();
    await firebaseStorage.clearAllImages();
    await firebaseStorage.uploadSampleImages();
    res.send("ok");
  } catch (error) {
    console.log("trycatch error", error);
    res
      .status(400)
      .send({ error: "Invalid /listingsInitialize.", message: error.message });
  }
});

module.exports = router;
