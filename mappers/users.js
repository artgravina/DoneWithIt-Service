const imageSettings = require("../config/settings");

const mapper = (user) => {
  const baseUrl = imageSettings.baseUrl;
  const publicUrlBase = `${baseUrl}/`;
  const iconUrl = user.icon ? `${publicUrlBase}${user.icon}` : null;

  return {
    ...user,
    iconUrl: iconUrl,
  };
};

module.exports = mapper;
