const express = require("express");
const firebaseStorage = require("../store/services/firebaseStorage");
const router = express.Router();

const store = require("../store/listings");
const auth = require("../middleware/auth");
const listingMapper = require("../mappers/listings");

router.get("/:id", auth, (req, res) => {
  const listing = store.getListing(parseInt(req.params.id));
  if (!listing) return res.status(404).send();
  const resource = listingMapper(listing);
  res.send(resource);
});

// router.delete("/:id", auth, async (req, res, next) => {
//   console.log("listing delete", req.params.id);
//   setTimeout(next, 5000);
// });

router.delete("/:id", auth, async (req, res) => {
  console.log("listing delete", req.params.id);
  const listing = store.getListing(parseInt(req.params.id));
  if (!listing) return res.status(404).send({ error: "listing not on file." });
  const iresp = await firebaseStorage.deleteListingImages(listing);
  const respListing = store.deleteListing(listing);
  res.send("delete ok");
});

module.exports = router;
