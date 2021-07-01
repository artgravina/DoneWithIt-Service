const express = require("express");
const router = express.Router();
const firebaseStorage = require("../store/firebaseStorage");

// delete files
router.get("/", async (req, res) => {
  try {
    console.log("begin delete");
    // const files = await listFiles("images/");
    const response = await firebaseStorage.deleteFiles("images/d1.jpg");
    console.log("response: ", response);
    res.send(`deleted ok: ${response}`);
  } catch (error) {
    console.log("trycatch error", error);
    res.status(400).send({ error: "Invalid /test.", message: error.message });
  }
});

/************************* 
// listfiles
router.get("/", async (req, res) => {
  try {
    console.log("begin");
    // const files = await listFiles("images/");
    const files = await firebaseStorage.listFiles(
      "images/0c67327-e2e-507d-7205-3ddb5ec6fb_thumb.jpg"
    );
    if (files) {
      console.log("3. ok");
      console.log(files[0]);
      res.send(`OK: ${files.length}`);
    } else {
      res.send("failed");
    }
  } catch (error) {
    console.log("trycatch error", error);
    res.status(400).send({ error: "Invalid /test.", message: error.message });
  }
});
******************** */
module.exports = router;
