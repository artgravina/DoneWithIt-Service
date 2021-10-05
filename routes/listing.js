const express = require("express");
const storage = require("../store/storage");
const router = express.Router();

const store = require("../store/listings");
const auth = require("../middleware/auth");
const listingMapper = require("../mappers/listings");

router.get("/:id", auth, (req, res) => {
  const listing = store.getListing(req.params.id);
  if (!listing) return res.status(404).send();
  const resource = listingMapper(listing);
  res.send(resource);
});

router.delete("/:id", auth, async (req, res) => {
  const listing = await store.getListing(req.params.id);
  if (!listing) return res.status(404).send({ error: "listing not on file." });
  const iresp = await storage.deleteListingImages(listing);
  const respListing = await store.deleteListing(listing.id);
  res.send("delete ok");
});

module.exports = router;
