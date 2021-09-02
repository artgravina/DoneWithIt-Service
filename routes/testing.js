const express = require("express");
const router = express.Router();
const listing = require("../services/firebase/firebaseListings");
const user = require("../services/firebase/firebaseUsers");

router.get("/", async (req, res) => {
  try {
    console.log("begin testings");
    user.test();
    const response = "nothing";
    res.send(`testing finished ok: ${response}`);
  } catch (error) {
    console.log("trycatch error", error);
    res.status(400).send({ error: "Invalid /test.", message: error.message });
  }
});

module.exports = router;
