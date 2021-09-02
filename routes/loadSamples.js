const auth = require("../middleware/auth");
const express = require("express");
const firebaseStorage = require("../services/firebase/firebaseStorage");
const router = express.Router();
const listingStore = require("../store/listings");
const userStore = require("../store/users");

router.get("/", auth, async (req, res) => {
  try {
    await userStore.clearUsers();
    await userStore.addSamples();
    await listingStore.clearListings();
    const numListings = await listingStore.addSamples();
    await firebaseStorage.clearAllImages();
    await firebaseStorage.addSamples();

    res.send("ok");
  } catch (error) {
    console.log("trycatch error", error);
    res
      .status(400)
      .send({ error: "Invalid /loadSamples.", message: error.message });
  }
});

module.exports = router;
