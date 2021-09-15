const mapper = (user) => {
  const baseUrl = process.env.BASE_IMAGE_URL;
  const port = process.env.PORT;
  const directory = "images";
  const publicUrlBase = `${baseUrl}:${port}/${directory}/`;
  const iconUrl = user.icon ? `${publicUrlBase}${user.icon}` : null;

  return {
    ...user,
    iconUrl: iconUrl,
  };
};

module.exports = mapper;
