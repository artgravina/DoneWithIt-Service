// TODO: make this dynamic to choose the appropriate service
const listingsService = require("../services/json-server/jsonListings");
const usersStore = require("../store/users");
var fs = require("fs");

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
  const newListing = await listingsService.addListing(listing);
  // return newListing;
};

const getListings = async () => {
  return await listingsService.getListings();
};

const getUserListings = async (userId) => {
  return await listingsService.getUserListings(userId);
};

const getListing = async (id) => {
  const listing = await listingsService.getListing(id);
  return listing;
};

const updateListing = async (listing) => {
  const resp = await listingsService.updateListing(listing);
};

const deleteListing = async (id) => {
  const response = await listingsService.deleteListing(id);
};

const addSamples = async () => {
  var json = fs.readFileSync("./uploads/sample_listings.json", "utf-8");
  const listingsArray = JSON.parse(json);
  for (const index in listingsArray) {
    const listingOrig = listingsArray[index];
    const { userEmail, ...listingNew } = listingOrig;

    const user = await usersStore.getUserByEmail(userEmail);
    let userId = 0;
    if (user) {
      userId = user.id;
    }
    listingNew.userId = userId;

    const newListing = await listingsService.addListing(listingNew);
    console.log("listingId: ", newListing.id, newListing.userId);
  }
};

const clearListings = async () => {
  await listingsService.deleteAll();
};

module.exports = {
  addListing,
  getListings,
  getListing,
  getUserListings,
  updateListing,
  deleteListing,
  clearListings,
  addSamples,
};
