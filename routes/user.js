const express = require("express");
const router = express.Router();

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const userMapper = require("../mappers/users");
const auth = require("../middleware/auth");

router.get("/:id", auth, async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await usersStore.getUserById(userId);
  if (!user) return res.status(404).send();
  const listingsArray = await listingsStore.getUserListings(user.id);
  user.listings = listingsArray ? listingsArray.length : 0;
  const resource = userMapper(user);
  res.send(resource);
});

module.exports = router;
