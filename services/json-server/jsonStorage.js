var fs = require("fs");
const sharp = require("sharp");
const imageSettings = require("../../config/settings");

console.log("jsonStorage settings: ", imageSettings);

// file is standard File object resulting in html upload
// filename is name of image
// params.size is the width you want converted to: i.e. thumbnail = 100, regular = 600
// params.quality is the image quality you desire
// if size = null no conversion
// returns the public url or error message
const upload = async (file, filename, params) => {
  const port = process.env.PORT;
  const baseUrl = imageSettings.baseUrl;
  const directory = imageSettings.directory;
  const fileUri = imageSettings.fileUri;
  const outputFile = `${fileUri}/${directory}/${filename}`;
  const publicUrl = `${baseUrl}/${filename}`;
  console.log("outputFile: ", outputFile);
  console.log("publicUrl: ", publicUrl);
  const newImageBuffer = await sharp(file.buffer)
    .resize(params.width)
    .jpeg({ quality: params.quality })
    .toFile(outputFile);

  return publicUrl;
};

async function listImages(filename) {
  const fileUri = imageSettings.fileUri;
  const directory = imageSettings.directory;
  const dirPath = `${fileUri}/${directory}`;
  const files = fs.readdirSync(dirPath);
  console.log("files: ", files);

  let filenames = [];
  files.forEach(function (name) {
    if (name.startsWith(filename)) {
      try {
        filenames.push(name);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("don't delete: ", name);
    }
  });

  return filenames;
}

//  delete all images with this prefix
async function deleteImages(filename) {
  const fileUri = imageSettings.fileUri;
  const directory = imageSettings.directory;
  const dirPath = `${fileUri}/${directory}`;
  const files = fs.readdirSync(dirPath);

  files.forEach(function (name) {
    if (name.startsWith(filename)) {
      try {
        const filePath = dirPath + "/" + name;
        console.log("filePath: ", filePath);
        fs.unlinkSync(filePath);
        //file removed
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("don't delete: ", name);
    }
  });
}

async function deleteFile(filename) {
  console.log("jsonStorage deleteFile: ", filename);
  const resp = await deleteImages(filename);
}

async function deleteListingImages(listing) {
  for (const index in listing.images) {
    let filename = listing.images[index].fileName;
    await deleteFile(filename);
  }
  return true;
}

// will delete both thumb/full for a url
async function deleteUrlImages(urls) {
  // console.log("deleteUrlImages: ", urls);
  // for (const index in urls) {
  //   const url = urls[index];
  //   const bucket = storage.bucket(bucketName);
  //   const fullname = url.split("/").pop();
  //   const filename = fullname.substr(0, fullname.lastIndexOf("."));
  //   await deleteFile(filename);
  // }
  // return true;
}

async function clearAllImages() {
  const fileUri = imageSettings.fileUri;
  const directory = imageSettings.directory;
  const dirPath = `${fileUri}/${directory}`;
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    try {
      const filePath = dirPath + "/" + file;
      console.log("filePath: ", filePath);
      fs.unlinkSync(filePath);
      //file removed
    } catch (err) {
      console.error(err);
    }
  });
}

async function addSamples() {
  var samplesDir = "./uploads/sample_images";
  console.log("addSample Images");
  const fileUri = imageSettings.fileUri;
  const directory = imageSettings.directory;
  const outDir = `${fileUri}/${directory}`;
  const files = fs.readdirSync(samplesDir);

  files.forEach(async function (file) {
    try {
      const fromPath = samplesDir + "/" + file;
      const toPath = outDir + "/" + file;
      const buffer = fs.readFileSync(fromPath);
      const data = await sharp(buffer).toFile(toPath);
      console.log("uploaded: ", toPath);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = {
  upload,
  deleteFile,
  deleteListingImages,
  addSamples,
  clearAllImages,
  listImages,
  deleteImages,
};
