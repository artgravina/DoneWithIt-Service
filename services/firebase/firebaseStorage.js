var fs = require("fs");
var path = require("path");
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

const storage = new Storage();
// A bucket is a container for objects (files).
const imagesBaseUrl = process.env.BASE_IMAGE_URL;
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);
const imagesPath = "images/";

// file is standard File object resulting in html upload
// path is complete path i.e. /folder/filename
// params.size is the width you want converted to: i.e. thumbnail = 100, regular = 600
// params.quality is the image quality you desire
// if size = null no conversion
// returns the public url or error message
const upload = async (file, path, params) => {
  const newImageBuffer = await sharp(file.buffer)
    .resize(params.width)
    .jpeg({ quality: params.quality })
    .toBuffer();

  file.buffer = newImageBuffer;

  const { originalname, buffer } = file;

  const promise = new Promise((resolve, reject) => {
    const blob = bucket.file(path);
    const blobStream = blob.createWriteStream({
      resumable: false,
      public: true,
    });
    blobStream
      .on("error", (err) => {
        reject(`Unable to upload image ${err.message}`);
      })
      .on("finish", async () => {
        const publicUrl = `${imagesBaseUrl}/${bucket.name}/${blob.name}`;

        resolve(publicUrl);
      })
      .end(buffer);
  });
  return promise;
};

async function listImages(path) {
  const bucket = storage.bucket(bucketName);
  const [files] = await bucket.getFiles({
    delimiter: "/",
    prefix: path,
  });
  let filenames = [];
  files.forEach((file) => {
    filenames.push(file.name);
  });
  return filenames;
}

//  delete all images with this prefix
async function deleteImages(path) {
  console.log("deleteImages", path);
  const bucket = storage.bucket(bucketName);
  return await bucket.deleteFiles(
    {
      delimiter: "/",
      prefix: path,
    },
    function (err) {
      if (err) console.log("deleteImages", err.message);
    }
  );
}

async function deleteFile(filename) {
  const path = `${imagesPath}${filename}`;
  const resp = await deleteImages(path);
}

async function deleteListingImages(listing) {
  const bucket = storage.bucket(bucketName);
  for (const index in listing.images) {
    let filename = listing.images[index].fileName;
    await deleteFile(filename);
  }
  return true;
}

// will delete both thumb/full for a url
async function deleteUrlImages(urls) {
  console.log("deleteUrlImages: ", urls);
  for (const index in urls) {
    const url = urls[index];
    const bucket = storage.bucket(bucketName);
    const fullname = url.split("/").pop();
    const filename = fullname.substr(0, fullname.lastIndexOf("."));
    await deleteFile(filename);
  }
  return true;
}

async function clearAllImages() {
  await deleteImages(imagesPath);
}

async function addSamples() {
  const bucket = storage.bucket(bucketName);
  var moveFrom = "./uploads/sample_images";

  console.log("addSample Images");
  // Loop through all the files in the temp directory
  fs.readdir(moveFrom, async function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      return;
    }

    let uploadFiles = [];
    files.forEach(function (file, index) {
      // Make one pass and make the file complete
      const fromPath = path.join(moveFrom, file);
      const filename = fromPath.split("/").pop();
      const destination = `${imagesPath}${filename}`;
      uploadFiles.push({ destination: destination, fromPath: fromPath });
    });

    for (const uploadFile of uploadFiles) {
      const { destination, fromPath } = uploadFile;

      const options = {
        destination: destination,
        public: true,
      };

      const imageFile = await bucket.upload(fromPath, options);
    }
    return;
  });
}

module.exports = {
  upload,
  deleteFile,
  deleteListingImages,
  addSamples,
  clearAllImages,
};
