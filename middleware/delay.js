const config = require("config");

module.exports = async (req, res, next) => {
  setTimeout(next, 5000);
};
