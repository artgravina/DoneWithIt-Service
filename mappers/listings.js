const imageSettings = require("../config/settings");

const mapper = (listing) => {
  const baseUrl = imageSettings.baseUrl;

  const publicUrlBase = `${baseUrl}/`;
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
