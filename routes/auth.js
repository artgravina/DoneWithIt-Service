const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersStore = require("../store/users");
const userMapper = require("../mappers/users");
const validateWith = require("../middleware/validation");

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

router.post("/", validateWith(schema), async (req, res) => {
  const { email, password } = req.body;
  const user = await usersStore.getUserByEmail(email);
  if (!user || user.password !== password)
    return res.status(400).send({ error: "Invalid email or password." });
  const userResource = userMapper(user);
  const token = jwt.sign(
    {
      id: userResource.id,
      name: userResource.name,
      iconUrl: userResource.iconUrl,
      email,
    },
    "jwtPrivateKey"
  );
  res.send(token);
});

module.exports = router;
