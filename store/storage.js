const storage = require("../services/json-server/jsonStorage");

// file is standard File object resulting in html upload
// path is complete path i.e. /folder/filename
// params.size is the width you want converted to: i.e. thumbnail = 100, regular = 600
// params.quality is the image quality you desire
// if size = null no conversion
const upload = async (file, path, params) => {
  const urlFull = await storage.upload(file, path, params);
};

async function deleteFile(filename) {
  await storage.deleteFile(filename);
}

// delete all images for this listing
async function deleteListingImages(listing) {
  return await storage.deleteListingImages(listing);
}

async function addSamples() {
  await storage.addSamples();
}

module.exports = {
  upload,
  deleteFile,
  deleteListingImages,
  addSamples,
};
