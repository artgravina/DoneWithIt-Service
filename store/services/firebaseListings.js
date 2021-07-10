const { Datastore } = require("@google-cloud/datastore");

// defines credentials for the datastore
// export GOOGLE_APPLICATION_CREDENTIALS="/Users/agravina/Software/ReactNative/Expo/GoogleCloud/donewithit-service/gcs-datastore-service.json"
const datastore = new Datastore();
const listingEntity = "Listings";

// for conventience I am adding back the key into the record. Ugh...
async function addListing(listing) {
  listing.updated = new Date().toJSON();
  const listingKey = datastore.key(listingEntity);
  const entity = {
    key: listingKey,
    data: listing,
  };
  await datastore.save(entity);
  // console.log("save successful");
  entity.data.listingId = entity.key.id;
  await updateListing(entity.data);
  // console.log("update successful");
  // console.log(`Listing created: ${entity.data}`);
  return entity.data;
}

async function getListing(listingId) {
  console.log("getListing: ", listingId);
  const kind = listingEntity;
  const id = datastore.int(listingId);
  const listingKey = datastore.key([kind, id]);
  console.log("get listingKey: ", listingKey);
  const [listing] = await datastore.get(listingKey);
  console.log("listing get 1: ", listing);
  return listing;
}

async function getListings() {
  const query = datastore.createQuery(listingEntity);
  const response = await datastore.runQuery(query);
  // 0 is data, 1 is moreResults, etc
  console.log("response: ", response[0]);
  return response[0]; // just the data
}

async function deleteListing(listingId) {
  const kind = listingEntity;
  const id = datastore.int(listingId);
  const listingKey = datastore.key([kind, id]);

  await datastore.delete(listingKey);
  console.log(`Listings ${listingId} deleted successfully.`);
  return true;
}

async function deleteAll() {
  const query = datastore.createQuery(listingEntity).select("__key__");
  const [entities] = await datastore.runQuery(query);
  entities.forEach(async (entity) => {
    let id = entity[datastore.KEY].id;
    await deleteListing(id);
  });
}

async function updateListing(listing) {
  const kind = listingEntity;
  const id = datastore.int(listing.listingId);
  const listingKey = datastore.key([kind, id]);

  const entity = {
    key: listingKey,
    data: listing,
  };
  await datastore.update(entity);
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

async function test() {
  try {
    // let response1 = await addListing(listing1);
    // console.log("1: ", response1);
    // let response2 = await addListing(listing2);
    // console.log("2: ", response2);

    await deleteAll();
    // let response1 = await addListing(listing1);
    // console.log("1: ", response1);
    // let response2 = await addListing(listing2);
    // console.log("2: ", response2);
    // let listing = await getListing(response1.listingId);
    // console.log("listing: ", listing);
    // listing.name = "Arthur";
    // const resp = await updateListing(listing);
    // console.log("update resp: ", resp);
    // const id = 5683780991844352;
    // const response = await deleteListing(id);
    // console.log(`listing ${id} deleted: ${response}`);
    // const listings = await getListings();
    // listings.forEach((listing) => {
    //   console.log("all: ", listing.listingId);
    // });
  } catch (err) {
    console.error("ERROR:", err);
  }
}

module.exports = {
  test,
  addListing,
  getListing,
  getListings,
  deleteListing,
  deleteAll,
  updateListing,
};
