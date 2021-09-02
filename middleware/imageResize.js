const uuid = require("react-uuid");
const firebaseStorage = require("../services/firebase/firebaseStorage");

module.exports = async (req, res, next) => {
  const images = [];
  const directory = "images";

  const resizePromises = req.files.map(async (file) => {
    file.filename = uuid();
    const bufferOrig = file.buffer;
    const fullPath = `${directory}/${file.filename}_full.jpg`;
    const urlFull = await firebaseStorage.upload(file, fullPath, {
      width: 2000,
      quality: 50,
    });
    // let's make this smaller
    // restore original buffer
    file.buffer = bufferOrig;
    const thumbPath = `${directory}/${file.filename}_thumb.jpg`;
    const urlThumb = await firebaseStorage.upload(file, thumbPath, {
      width: 100,
      quality: 30,
    });
    images.push(file.filename);
  });

  await Promise.all([...resizePromises]);

  req.images = images;

  next();
};
