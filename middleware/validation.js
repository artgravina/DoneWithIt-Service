const Joi = require("joi");

module.exports = (schema) => (req, res, next) => {
  const result = Joi.validate(req.body, schema);

  if (result.error) {
    console.log("result.error: ", result.error.details[0]);
    return res.status(400).send({ error: result.error.details[0].message });
  }
  next();
};
