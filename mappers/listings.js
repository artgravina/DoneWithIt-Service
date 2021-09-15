const mapper = (listing) => {
  const baseUrl = process.env.BASE_IMAGE_URL;
  const port = process.env.PORT;
  const directory = "images";
  const publicUrlBase = `${baseUrl}:${port}/${directory}/`;
  const mapImage = (image) => ({
    url: `${publicUrlBase}${image.fileName}_full.jpg`,
    thumbnailUrl: `${publicUrlBase}${image.fileName}_thumb.jpg`,
  });

  return {
    ...listing,
    images: listing.images.map(mapImage),
  };
};

module.exports = mapper;
