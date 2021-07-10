const firebaseListings = require("../store/services/firebaseListings");
var fs = require("fs");

let listings = [];
const listingsSample = [
  {
    id: 201,
    title: "Red jacket",
    images: [{ fileName: "jacket1" }],
    price: 100,
    categoryId: 5,
    userEmail: "mosh@domain.com",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 3,
    title: "Gray couch in a great condition",
    images: [{ fileName: "couch2" }],
    categoryId: 1,
    price: 1200,
    userEmail: "john@domain.com",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 1,
    title: "Room & Board couch (great condition) - delivery included",
    description:
      "I'm selling my furniture at a discount price. Pick up at Venice. DM me asap.",
    images: [
      { fileName: "couch1" },
      { fileName: "couch2" },
      { fileName: "couch3" },
    ],
    price: 1000,
    categoryId: 1,
    userEmail: "mosh@domain.com",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 2,
    title: "Designer wear shoes",
    images: [{ fileName: "shoes1" }],
    categoryId: 5,
    price: 100,
    userEmail: "john@domain.com",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 102,
    title: "Canon 400D (Great Condition)",
    images: [{ fileName: "camera1" }],
    price: 300,
    categoryId: 3,
    userEmail: "mosh@domain.com",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 101,
    title: "Nikon D850 for sale",
    images: [{ fileName: "camera2" }],
    price: 350,
    categoryId: 3,
    userEmail: "mosh@domain.com",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 4,
    title: "Sectional couch - Delivery available",
    description: "No rips no stains no odors",
    images: [{ fileName: "couch3" }],
    categoryId: 1,
    price: 950,
    userEmail: "john@domain.com",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 6,
    title: "Brown leather shoes",
    images: [{ fileName: "shoes2" }],
    categoryId: 5,
    price: 50,
    userEmail: "john@domain.com",
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
];

const addListing = async (listing) => {
  const newListing = await firebaseUsers.addListing(listing);
  listings.push(listing);
  // return newListing;
};

const getListings = async () => {
  return await firebaseListings.getListings();
};

const getListing = async (id) => {
  const listing = await firebaseListings.getListing(id);
  return listing;
};

const updateListing = async (listing) => {
  console.log(listing);
  const resp = await firebaseListings.updateListing(listing);
};

const deleteListing = async (listing) => {
  console.log(listing);
  const response = await firebaseListings.deleteListing(id);
};

const addSamples = async () => {
  var json = fs.readFileSync("./uploads/sample_listings.json", "utf-8");
  const listingsArray = JSON.parse(json);
  let users = [];
  listingsArray.forEach(async (listing) => {
    const newListing = await firebaseListings.addListing(listing);
    console.log("listingId: ", newListing.listingId);
  });
};

const clearListings = async () => {
  await firebaseListings.deleteAll();
};

module.exports = {
  addListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  clearListings,
  addSamples,
};
