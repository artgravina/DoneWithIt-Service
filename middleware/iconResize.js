const uuid = require("react-uuid");
const firebaseStorage = require("../store/services/firebaseStorage");

module.exports = async (req, res, next) => {
  const directory = "images";
  let file = req.file;
  if (file) {
    file.filename = `${uuid()}_userIcon.jpg`;
    const bufferOrig = file.buffer;
    const fullPath = `${directory}/${file.filename}`;
    console.log("uploading icon: ", file.filename);
    const urlFull = await firebaseStorage.upload(file, fullPath, {
      width: 200,
      quality: 50,
    });
    req.filename = file.filename;
  }

  next();
};
