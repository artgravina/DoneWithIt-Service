const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Multer = require("multer");
const usersStore = require("../store/users");
const userMapper = require("../mappers/users");
const iconResize = require("../middleware/iconResize");
const auth = require("../middleware/auth");
const storage = require("../store/storage");

const validateWith = require("../middleware/validation");
const { exist } = require("joi/lib/types/lazy");

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schemaPost = {
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(4),
  userIcon: Joi.string().optional(),
  deleteOrigIcon: Joi.boolean().optional(),
};

router.post(
  "/",
  // following uploads to firebase and adds filename to req
  [multer.single("userIcon"), validateWith(schemaPost), iconResize],

  async (req, res) => {
    console.log("userIcon filename: ================", req.filename);

    const { name, email, password } = req.body;
    const existingUser = await usersStore.getUserByEmail(email);
    console.log("existingUser: ", existingUser);
    if (existingUser) {
      return res
        .status(400)
        .send({ error: "A user with the given email already exists." });
    }
    const user = { name, email, password };
    user.icon = req.filename; // see above
    const newuser = await usersStore.addUser(user);
    user.id = newuser.id;

    const userResource = userMapper(user);
    console.log("userAdded: ", userResource);
    res.status(201).send(userResource);
  }
);

router.get("/", (req, res) => {
  res.send(usersStore.getUsers());
});

const schemaUpdate = {
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  userIcon: Joi.string().optional(),
  deleteOrigIcon: Joi.boolean().optional(),
};

router.put(
  "/:id",
  auth,
  [multer.single("userIcon"), validateWith(schemaUpdate), iconResize],

  async (req, res) => {
    console.log("updateUser start");
    const userId = parseInt(req.params.id);

    const updatedUser = await usersStore.getUserById(userId);
    if (!updatedUser) {
      return res.status(400).send({ error: "User is not on file." });
    }
    const deleteOrigIcon = req.body.deleteOrigIcon;
    updatedUser.name = req.body.name;
    updatedUser.email = req.body.email;
    const oldIcon = updatedUser.icon;
    const newIcon = req.body.userIcon;

    if (deleteOrigIcon === true) {
      // we have to delete old one\
      console.log("Delete Prior icon: ", updatedUser.icon);
      await storage.deleteFile(updatedUser.icon);
    }

    // add our new icon if there
    updatedUser.icon = req.filename;
    // res.status(201).send("test ok");
    // return;
    //=============
    await usersStore.updateUser(updatedUser);

    res.status(201).send(updatedUser);
  }
);

const schemaPassword = {
  userId: Joi.string().required(),
  password: Joi.string().required().min(4),
};

router.post(
  "/password",
  auth,
  [validateWith(schemaPassword)],

  async (req, res) => {
    const userId = req.body.userId;
    const updatedUser = await usersStore.getUserById(userId);
    if (!updatedUser) {
      return res.status(400).send({ error: "User is not on file." });
    }

    updatedUser.password = req.body.password;
    await usersStore.updateUser(updatedUser);

    res.status(201).send(updatedUser);
  }
);
module.exports = router;
