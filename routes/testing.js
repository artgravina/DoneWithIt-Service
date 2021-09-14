const express = require("express");
const router = express.Router();
const storage = require("../store/storage");

router.get("/", async (req, res) => {
  try {
    console.log("begin testings");
    await storage.deleteFile("d35e8a-7c5e-6be-d6f0-7df6d2da037a_userIcon.jpg");
    res.send(`testing finished ok: `);
  } catch (error) {
    console.log("trycatch error", error);
    res.status(400).send({ error: "Invalid /test.", message: error.message });
  }
});

module.exports = router;
