const express = require("express");
const router = express.Router();

const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");
const listingMapper = require("../mappers/listings");

router.get("/:id", auth, async (req, res) => {
  const userId = req.params.id;
  const listings = await listingsStore.getUserListings(userId);
  const resources = listings.map(listingMapper);
  res.send(resources);
});

module.exports = router;
