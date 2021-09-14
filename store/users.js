var fs = require("fs");
// const userService = require("../services/firebase/firebaseUsers");
const userService = require("../services/json-server/jsonusers");

const getUsers = async () => {
  const users = await userService.getUsers();
  return users;
};

const getUserById = async (id) => {
  const user = await userService.getUser(id);
  console.log("user: ", user);
  return user;
};

// the user is our id since it must be unique.
const getUserByEmail = async (email) => {
  const user = await userService.getUserByEmail(email);
  return user;
};

const addUser = async (user) => {
  const newUser = await userService.addUser(user);
  return newUser;
};

const updateUser = async (user) => {
  const updatedUser = await userService.updateUser(user);
  return updatedUser;
};

const deleteUser = async (userId) => {
  await userService.deleteUser(userId);
};

const addUserSamples = async (usersArray) => {
  for (const index in usersArray) {
    const user = usersArray[index];
    const userFound = await userService.getUserByEmail(user.email);
    if (!userFound) {
      const newuser = await userService.addUser(user);
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
  await userService.deleteAll();
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
