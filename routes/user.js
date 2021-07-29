const express = require("express");
const router = express.Router();

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const userMapper = require("../mappers/users");
const auth = require("../middleware/auth");

router.get("/:id", auth, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = usersStore.getUserById(userId);
  if (!user) return res.status(404).send();
  const listingsArray = listingsStore.getUserListings(user.id);
  user.listings = listingsArray ? listingsArray.length : 0;

  const resource = userMapper(user);
  console.log("getUser: ", resource);
  res.send(resource);
});

module.exports = router;
