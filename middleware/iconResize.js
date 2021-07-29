const uuid = require("react-uuid");
const firebaseStorage = require("../store/services/firebaseStorage");

module.exports = async (req, res, next) => {
  const directory = "images";
  let file = req.file;
  if (!file) {
    console.error("file is empty: ======", file);
    // console.log(req);
  }
  file.filename = uuid();
  const bufferOrig = file.buffer;
  const fullPath = `${directory}/${file.filename}_userIcon.jpg`;
  const urlFull = await firebaseStorage.upload(file, fullPath, {
    width: 200,
    quality: 50,
  });
  req.filename = file.filename;
  next();
};
