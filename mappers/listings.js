const mapper = (listing) => {
  const baseUrl = process.env.BASE_IMAGE_URL;
  const mapImage = (image) => ({
    url: `${baseUrl}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
  });

  return {
    ...listing,
    images: listing.images.map(mapImage),
  };
};

module.exports = mapper;
