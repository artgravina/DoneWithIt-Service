const auth = require("../middleware/auth");
const express = require("express");
const firebaseStorage = require("../store/firebaseStorage");
const router = express.Router();
const store = require("../store/listings");

router.get("/", auth, async (req, res) => {
  try {
    const numListings = store.addSamples();
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
