const express = require("express");
const Joi = require("joi");
const Multer = require("multer");
const router = express.Router();

const auth = require("../middleware/auth");
const categoriesStore = require("../store/categories");
const imageResize = require("../middleware/imageResize");
const store = require("../store/listings");
const listingMapper = require("../mappers/listings");
const validateWith = require("../middleware/validation");
const storage = require("../store/storage");

// Multer is required to process file uploads and make them available via
// req.files.
const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required().min(1),
  categoryId: Joi.number().required().min(1),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).optional(),
  existingFilenames: Joi.string().optional(),
  deletedFilenames: Joi.string().optional(),
};

const validateCategoryId = (req, res, next) => {
  if (!categoriesStore.getCategory(parseInt(req.body.categoryId)))
    return res.status(400).send({ error: "Invalid categoryId." });

  next();
};

const track = (req, res, next) => {
  console.log("track: ");

  next();
};

router.get("/", async (req, res) => {
  const listings = await store.getListings();
  const resources = listings.map(listingMapper);
  res.send(resources);
});

router.post(
  "/",
  auth,
  [
    // Order of these middleware matters.
    // "upload" should come before other "validate" because we have to handle
    // multi-part form data. Once the upload middleware from multer applied,
    // request.body will be populated and we can validate it. This means
    // if the request is invalid, we'll end up with one or more image files
    // stored in the uploads folder. We'll need to clean up this folder
    // using a separate process.
    // auth,
    upload.array("images", process.env.MAX_IMAGE_COUNT),
    validateWith(schema),
    validateCategoryId,
    imageResize,
  ],

  async (req, res) => {
    const listing = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: parseInt(req.body.categoryId),
      description: req.body.description,
    };
    listing.images = req.images.map((fileName) => ({ fileName: fileName }));
    if (req.body.location) listing.location = JSON.parse(req.body.location);
    if (req.user) listing.userId = req.user.id;

    store.addListing(listing);

    res.status(201).send(listing);
  }
);

router.put(
  "/:id",
  auth,
  [
    // Order of these middleware matters.
    // "upload" should come before other "validate" because we have to handle
    // multi-part form data. Once the upload middleware from multer applied,
    // request.body will be populated and we can validate it. This means
    // if the request is invalid, we'll end up with one or more image files
    // stored in the uploads folder. We'll need to clean up this folder
    // using a separate process.
    // auth,

    upload.array("images", process.env.MAX_IMAGE_COUNT),
    validateWith(schema),
    validateCategoryId,
    imageResize,
  ],

  async (req, res) => {
    try {
      console.log("updateListings", req.params);
      const listing = {
        id: req.params.id,
        title: req.body.title,
        price: parseFloat(req.body.price),
        categoryId: parseInt(req.body.categoryId),
        description: req.body.description,
      };

      const newFilenames = req.images.map((fileName) => ({
        fileName: fileName,
      }));
      const existingFilenames = JSON.parse(req.body.existingFilenames);
      const deletedFilenames = JSON.parse(req.body.deletedFilenames);

      listing.images = [];
      // Files that have been already uploaded
      for (const index in existingFilenames) {
        const filename = existingFilenames[index];
        listing.images.push({ fileName: filename });
      }

      // Files that have been uploaded this time
      for (const index in newFilenames) {
        const image = newFilenames[index];
        listing.images.push(image);
      }

      // existing image user has deleted
      for (const index in deletedFilenames) {
        const filename = deletedFilenames[index];
        await storage.deleteFile(filename);
      }

      if (req.body.location) listing.location = JSON.parse(req.body.location);
      if (req.user) listing.userId = req.user.id;

      // res.status(201).send("test ok");
      // return;
      //=============

      store.updateListing(listing);

      res.status(201).send(listing);
    } catch (error) {
      console.log(error.message);
      res.status(404).send({ error: error.message });
    }
  }
);

module.exports = router;
