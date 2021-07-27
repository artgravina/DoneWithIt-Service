const config = require("config");

const mapper = (user) => {
  const baseUrl = config.get("imagesBaseUrl");
  const mapImage = (image) => {
    const icon = `${baseUrl}${image.fileName}_icon.jpg`;
    return icon;
  };

  return {
    ...user,
    iconUrl: mapImage(user.icon),
  };
};

module.exports = mapper;
