const uuid = require("react-uuid");
const storage = require("../store/storage");

module.exports = async (req, res, next) => {
  const directory = "images";
  let file = req.file;
  if (file) {
    file.filename = `${uuid()}_userIcon.jpg`;
    const bufferOrig = file.buffer;
    const fullPath = `${directory}/${file.filename}`;
    console.log("uploading icon: ", file.filename);
    const urlFull = await storage.upload(file, fullPath, {
      width: 200,
      quality: 50,
    });
    req.filename = file.filename;
  }

  next();
};
