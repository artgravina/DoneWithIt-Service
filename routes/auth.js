const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersStore = require("../store/users");
const userMapper = require("../mappers/users");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(4),
};

const tokenize = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      icon: user.icon,
      iconUrl: user.iconUrl,
      email: user.email,
    },
    "jwtPrivateKey"
  );
  return token;
};

router.post("/login", validateWith(schema), async (req, res) => {
  const { email, password } = req.body;
  console.log("/login: ", email, password);
  const user = await usersStore.getUserByEmail(email);
  if (!user || user.password !== password)
    return res.status(400).send({ error: "Invalid email or password." });
  const userResource = userMapper(user);
  const token = tokenize(userResource);

  res.send(token);
});

router.post("/refresh", auth, async (req, res) => {
  const { userId } = req.body;
  console.log("/refresh: ", userId);
  const updatedUser = await usersStore.getUserById(userId);
  console.log("updatedUsder: ", updatedUser);
  if (!updatedUser) return res.status(400).send({ error: "Invalid userId." });
  const userResource = userMapper(updatedUser);
  const token = tokenize(userResource);
  console.log("token: ", token);

  console.log("token: ", token);
  res.send(token);
});

module.exports = router;
