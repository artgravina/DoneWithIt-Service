const mapper = (user) => {
  const baseUrl = process.env.BASE_IMAGE_URL;
  const port = process.env.PORT;
  const directory = "images";
  const iconUrl = user.icon
    ? `${baseUrl}:${port}/${directory}/${user.icon}`
    : null;

  return {
    ...user,
    iconUrl: iconUrl,
  };
};

module.exports = mapper;
