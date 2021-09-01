const config = require("config");

const mapper = (user) => {
  const baseUrl = config.get("imagesBaseUrl");
  const iconUrl = user.icon ? `${baseUrl}${user.icon}` : null;

  return {
    ...user,
    iconUrl: iconUrl,
  };
};

module.exports = mapper;
