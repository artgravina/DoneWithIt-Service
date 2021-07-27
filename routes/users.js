const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Multer = require("multer");
const usersStore = require("../store/users");
const iconResize = require("../middleware/iconResize");

const validateWith = require("../middleware/validation");
const { exist } = require("joi/lib/types/lazy");

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
  userIcon: Joi.string().optional(),
};

router.post(
  "/",
  // [upload.single("userIcon"), validateWith(schema), iconResize],
  [multer.single("userIcon"), validateWith(schema), iconResize],

  async (req, res) => {
    console.log("userIcon filename: ================", req.filename);

    const { name, email, password } = req.body;
    const existingUser = await usersStore.getUserByEmail(email);
    console.log("existingUser: ", existingUser);
    if (existingUser)
      return res
        .status(400)
        .send({ error: "A user with the given email already exists." });

    const user = { name, email, password };
    user.icon = req.filename;
    const newuser = await usersStore.addUser(user);
    user.id = newuser.id;
    console.log("userAdded: ", user);

    res.status(201).send(user);
  }
);

router.get("/", (req, res) => {
  res.send(usersStore.getUsers());
});

module.exports = router;
