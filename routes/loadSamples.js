const auth = require("../middleware/auth");
const express = require("express");
const storage = require("../store/storage");
const router = express.Router();
const listingsStore = require("../store/listings");
const usersStore = require("../store/users");

router.get("/", auth, async (req, res) => {
  try {
    await usersStore.clearUsers();
    await usersStore.addSamples();
    await listingsStore.clearListings();
    const numListings = await listingsStore.addSamples();
    await storage.clearAllImages();
    await storage.addSamples();

    res.send("ok");
  } catch (error) {
    console.log("trycatch error", error);
    res
      .status(400)
      .send({ error: "Invalid /loadSamples.", message: error.message });
  }
});

module.exports = router;
