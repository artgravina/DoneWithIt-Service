const uuid = require("react-uuid");
const storage = require("../store/storage");

module.exports = async (req, res, next) => {
  const directory = "images";
  let file = req.file;
  if (file) {
    file.filename = `${uuid()}_userIcon.jpg`;
    console.log("uploading icon: ", file.filename);
    const urlFull = await storage.upload(file, file.filename, {
      width: 200,
      quality: 50,
    });
    req.filename = file.filename;
  }

  next();
};
