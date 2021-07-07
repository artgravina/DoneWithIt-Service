const { Datastore } = require("@google-cloud/datastore");
const uuid = require("react-uuid");
const { getUserById } = require("../users");

// defines credentials for the datastore
// export GOOGLE_APPLICATION_CREDENTIALS="/Users/agravina/Software/ReactNative/Expo/GoogleCloud/donewithit-service/gcs-datastore-service.json"
const datastore = new Datastore();
const userEntity = "Users";

async function addUser(user) {
  const userId = uuid();
  console.log("userId: ", userId);
  user.userId = userId;
  const userKey = datastore.key([userEntity, userId]);
  const entity = {
    key: userKey,
    data: user,
  };
  await datastore.save(entity);
  return userId;
}

async function getUser(userId) {
  const kind = userEntity;
  const name = userId;
  const userKey = datastore.key([kind, name]);
  console.log("get userKey: ", userKey);
  const [user] = await datastore.get(userKey);

  return user;
}

async function getAllUsers() {
  const query = datastore.createQuery(userEntity);
  const response = await datastore.runQuery(query);
  // 0 is data, 1 is moreResults, etc
  return response[0]; // just the data
}

async function deleteUser(userId) {
  const kind = userEntity;
  const name = userId;
  const userKey = datastore.key([kind, name]);

  await datastore.delete(userKey);
  console.log(`Users ${userId} deleted successfully.`);
  return true;
}

async function updateUser(user) {
  const kind = userEntity;
  const name = user.userId;
  const userKey = datastore.key([kind, name]);

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
    let user1Id = await addUser(user1);
    console.log(user1Id);
    let user2Id = await addUser(user2);
    console.log(user2Id);
    let user = await getUser(user1Id);
    console.log(user);
    user.name = "Arthur";
    const resp = await updateUser(user);
    console.log("update resp: ", resp);
    const users = await getAllUsers();
    users.forEach((user) => {
      console.log(user.userId);
    });
  } catch (err) {
    console.error("ERROR:", err);
  }
}

module.exports = {
  test,
};
