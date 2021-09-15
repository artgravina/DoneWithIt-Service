const fs = require("fs");
const uuid = require("react-uuid");

const dataPath = "./data/listings.json";
console.log("dataPath: ", dataPath);

function readFile(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

function writeFile(path, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, JSON.stringify(data), "utf8", function (err, data) {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function addListing(listing) {
  try {
    const data = await readFile(dataPath);
    listing.updated = new Date().toJSON();
    listing.id = uuid();
    data.push(listing);

    await writeFile(dataPath, data);
    return listing;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function getListing(listingId) {
  try {
    const data = await readFile(dataPath);
    const listing = data.find((listing) => listing.id === listingId);
    console.log(listing);
    return listing;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

const debugListings = (listingArray) => {
  console.log("json getListings ==============");
  listingArray.forEach((listing) => {
    console.log(listing.title, listing.images[0]);
  });
  console.log("end ==================");
};

async function getListings() {
  try {
    const data = await readFile(dataPath);
    // console.log(debugListings(data));
    return data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

const getUserListings = async (userId) => {
  try {
    const data = await readFile(dataPath);
    const listings = data.filter((listing) => listing.userId === userId);
    return listings;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
async function deleteListing(listingId) {
  try {
    const data = await readFile(dataPath);
    const newdata = data.filter((listing) => listing.id !== listingId);
    await writeFile(dataPath, newdata);
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

async function deleteAll() {
  const data = [];
  await writeFile(dataPath, data);
}

async function updateListing(listing) {
  try {
    const data = await readFile(dataPath);
    const index = data.findIndex((element) => element.id === listing.id);
    if (index !== -1) {
      listing.updated = new Date().toJSON();
      data[index] = listing;
      await writeFile(dataPath, data);
    }
  } catch (error) {
    console.error(error.message);
  }
}

const listing1 = {
  title: "Red jacket",
  images: [{ fileName: "jacket1" }],
  price: 100,
  categoryId: 5,
  userEmail: "mosh@domain.com",
  location: {
    latitude: 37.78825,
    longitude: -122.4324,
  },
};
const listing2 = {
  title: "Gray couch in a great condition",
  images: [{ fileName: "couch2" }],
  categoryId: 1,
  price: 1200,
  userEmail: "john@domain.com",
  location: {
    latitude: 37.78825,
    longitude: -122.4324,
  },
};

module.exports = {
  addListing,
  getListing,
  getListings,
  getUserListings,
  deleteListing,
  deleteAll,
  updateListing,
};
