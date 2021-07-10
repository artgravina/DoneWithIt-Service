const express = require("express");
const router = express.Router();
// const listing = require("../store/services/firebaseListings");
const listing = require("../store/listings");

// delete files
router.get("/", async (req, res) => {
  try {
    console.log("begin testing");
    await listing.clearListings();
    await listing.addSamples();
    console.log("listings cleared");
    const response = "nothing";
    res.send(`testing finished ok: ${response}`);
  } catch (error) {
    console.log("trycatch error", error);
    res.status(400).send({ error: "Invalid /test.", message: error.message });
  }
});

module.exports = router;
