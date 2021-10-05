const uuid = require("react-uuid");
const storage = require("../store/storage");

module.exports = async (req, res, next) => {
  const images = [];

  const resizePromises = req.files.map(async (file) => {
    file.filename = uuid();
    const bufferOrig = file.buffer;
    const fullPath = `${file.filename}_full.jpg`;
    const urlFull = await storage.upload(file, fullPath, {
      width: 2000,
      quality: 50,
    });
    // let's make this smaller
    // restore original buffer
    file.buffer = bufferOrig;
    const thumbPath = `${file.filename}_thumb.jpg`;
    const urlThumb = await storage.upload(file, thumbPath, {
      width: 100,
      quality: 30,
    });
    images.push(file.filename);
  });

  await Promise.all([...resizePromises]);

  req.images = images;

  next();
};
