const express = require("express");
const router = express.Router();

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const userMapper = require("../mappers/users");
const auth = require("../middleware/auth");
const firebaseStorage = require("../store/services/firebaseStorage");

router.get("/listings/:id", auth, async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await usersStore.getUserById(userId);
  if (!user) return res.status(404).send();
  const listingsArray = await listingsStore.getUserListings(user.id);
  user.listings = listingsArray ? listingsArray.length : 0;
  const resource = userMapper(user);
  res.send(resource);
});

router.get("/:id", auth, async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await usersStore.getUserById(userId);
  if (!user) return res.status(404).send();
  const resource = userMapper(user);
  res.send(resource);
});

router.delete("/:id", auth, async (req, res) => {
  const userId = parseInt(req.params.id);
  console.log("user delete", req.params.id);
  const user = await usersStore.getUserById(userId);

  const listingsArray = await listingsStore.getUserListings(user.id);

  for (const index in listingsArray) {
    const listing = listingsArray[index];
    const iresp = await firebaseStorage.deleteListingImages(listing);
    await listingsStore.deleteListing(listing.id);
  }
  await firebaseStorage.deleteFile(user.icon);
  await usersStore.deleteUser(user.id);
  res.send(`user deleted ok: ${user.name}`);
});

module.exports = router;
