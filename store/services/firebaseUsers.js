const { Datastore } = require("@google-cloud/datastore");

// defines credentials for the datastore
// export GOOGLE_APPLICATION_CREDENTIALS="/Users/agravina/Software/ReactNative/Expo/GoogleCloud/donewithit-service/gcs-datastore-service.json"
const datastore = new Datastore();
const userEntity = "Users";

async function addUser(user) {
  user.updated = new Date().toJSON();
  const userKey = datastore.key(userEntity);
  const entity = {
    key: userKey,
    data: user,
  };
  await datastore.save(entity);
  entity.data.id = entity.key.id;
  await updateUser(entity.data);
  return entity.data;
}

async function getUser(userId) {
  const kind = userEntity;
  const id = datastore.int(userId);
  const userKey = datastore.key([kind, id]);
  const [user] = await datastore.get(userKey);
  return user;
}

async function getUsers() {
  const query = datastore.createQuery(userEntity);
  const response = await datastore.runQuery(query);
  // 0 is data, 1 is moreResults, etc
  return response[0]; // just the data
}

async function getUserByEmail(email) {
  const query = datastore
    .createQuery(userEntity)
    .filter("email", "=", email)
    .limit(1);
  const response = await datastore.runQuery(query);
  if (response && response[0].length > 0) {
    return response[0][0];
  } else {
    return null;
  }
}

async function deleteUser(userId) {
  const kind = userEntity;
  const id = datastore.int(userId);
  const userKey = datastore.key([kind, id]);

  await datastore.delete(userKey);
  console.log(`Users ${userId} deleted successfully.`);
  return true;
}

async function deleteAll() {
  const query = datastore.createQuery(userEntity).select("__key__");
  const [entities] = await datastore.runQuery(query);
  for (const index in entities) {
    const entity = entities[index];
    let id = entity[datastore.KEY].id;
    await deleteUser(id);
  }
}

async function updateUser(user) {
  const kind = userEntity;
  const id = datastore.int(user.id);
  const userKey = datastore.key([kind, id]);

  const entity = {
    key: userKey,
    data: user,
  };
  await datastore.update(entity);
}

const user1 = {
  name: "Mosh",
  email: "mosh@domain.com",
  password: "12345",
};
const user2 = {
  name: "John",
  email: "john@domain.com",
  password: "12345",
};
async function test() {
  try {
    // const user1data = await addUser(user1);
    // console.log("addedUser: ", user1data);
    // const user2data = await addUser(user2);
    // console.log("addedUser: ", user2data);
    // let userbyget = await getUser(user1data.id);
    // console.log("getUser: ", userbyget);
    const userbyemail = await getUserByEmail("john@domain.com");
    console.log("email user", userbyemail);
    userbyemail.name = "Arthur";
    await updateUser(userbyemail);
    const users = await getUsers();
    users.forEach((user) => {
      console.log(user.id);
    });
  } catch (err) {
    console.error("ERROR:", err);
  }
}

module.exports = {
  test,
  addUser,
  getUser,
  getUserByEmail,
  getUsers,
  deleteUser,
  deleteAll,
  updateUser,
};
