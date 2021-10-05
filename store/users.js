var fs = require("fs");

// TODO: make this dynamic to choose the appropriate service
let usersService;
if (process.env.IS_JSON_SERVER) {
  usersService = require("../services/json-server/jsonUsers");
} else if (process.env.IS_GCLOUD_SERVER) {
  usersService = require("../services/firebase/firebaseUsers");
} else {
  console.log("no users service available!");
}

const getUsers = async () => {
  const users = await usersService.getUsers();
  return users;
};

const getUserById = async (id) => {
  const user = await usersService.getUser(id);
  console.log("user: ", user);
  return user;
};

// the user is our id since it must be unique.
const getUserByEmail = async (email) => {
  const user = await usersService.getUserByEmail(email);
  return user;
};

const addUser = async (user) => {
  const newUser = await usersService.addUser(user);
  return newUser;
};

const updateUser = async (user) => {
  const updatedUser = await usersService.updateUser(user);
  return updatedUser;
};

const deleteUser = async (userId) => {
  await usersService.deleteUser(userId);
};

const addUserSamples = async (usersArray) => {
  for (const index in usersArray) {
    const user = usersArray[index];
    const userFound = await usersService.getUserByEmail(user.email);
    if (!userFound) {
      const newuser = await usersService.addUser(user);
    }
  }
};

// only re-add user if not there.
const addSamples = async () => {
  try {
    var json = fs.readFileSync("./uploads/sample_users.json", "utf-8");
    const usersArray = JSON.parse(json);
    await addUserSamples(usersArray);
  } catch (error) {
    console.log("uses addSamples: ", error);
  }
};

const clearUsers = async () => {
  await usersService.deleteAll();
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  addSamples,
  clearUsers,
};
