const express = require("express");
const router = express.Router();
const users = require("../store/services/firebaseUsers");

// delete files
router.get("/", async (req, res) => {
  try {
    console.log("begin testing");
    users.test();
    const response = "nothing";
    res.send(`testing finished ok: ${response}`);
  } catch (error) {
    console.log("trycatch error", error);
    res.status(400).send({ error: "Invalid /test.", message: error.message });
  }
});

module.exports = router;
