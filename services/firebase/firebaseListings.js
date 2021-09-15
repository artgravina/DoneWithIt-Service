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
  entity.data.id = entity.key.id;
  await updateListing(entity.data);
  return entity.data;
}

async function getListing(listingId) {
  console.log("getListing: ", listingId);
  const kind = listingEntity;
  const id = datastore.int(listingId);
  const listingKey = datastore.key([kind, id]);
  const [listing] = await datastore.get(listingKey);
  return listing;
}

const debugListings = (listingArray) => {
  console.log("getListings ==============");
  listingArray.forEach((listing) => {
    console.log(listing.title);
  });
  console.log("end ==================");
};

async function getListings() {
  const query = datastore.createQuery(listingEntity).order("updated", {
    descending: true,
  });
  const response = await datastore.runQuery(query);
  // 0 is data, 1 is moreResults, etc
  // debugListings(response[0]);
  return response[0]; // just the data
}

const getUserListings = async (userId) => {
  const query = datastore
    .createQuery(listingEntity)
    .filter("userId", "=", userId)
    .order("updated", {
      descending: true,
    });

  const response = await datastore.runQuery(query);
  debugListings(response[0]);
  return response[0];
};
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
  for (const index in entities) {
    const entity = entities[index];
    let id = entity[datastore.KEY].id;
    await deleteListing(id);
  }
}

async function updateListing(listing) {
  console.log("updateListing: ", listing);
  listing.updated = new Date().toJSON();
  const kind = listingEntity;
  const id = datastore.int(listing.id);
  const listingKey = datastore.key([kind, id]);

  const entity = {
    key: listingKey,
    data: listing,
  };
  await datastore.update(entity);
}

module.exports = {
  addListing,
  getListing,
  getListings,
  getUserListings,
  deleteListing,
  deleteAll,
  updateListing,
};
