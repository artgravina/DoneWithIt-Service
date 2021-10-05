const express = require("express");
const router = express.Router();
// const storage = require("../services/json-server/jsonStorage");

router.get("/", async (req, res) => {
  try {
    console.log("begin testings");
    // const files = await storage.deleteImages(
    //   "7da4f8-657-cb87-af72-8053a63e4ebe"
    // );
    // console.log("Files: ", files);

    res.send(`testing finished ok: `);
  } catch (error) {
    console.log("trycatch error", error);
    res.status(400).send({ error: "Invalid /test.", message: error.message });
  }
});

module.exports = router;
