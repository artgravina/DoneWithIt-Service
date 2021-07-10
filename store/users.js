var fs = require("fs");
const firebaseUsers = require("../store/services/firebaseUsers");

const getUsers = () => {
  users = firebaseUsers.getUsers();
};

const getUserById = async (id) => {
  const user = await firebaseUsers.getUser(id);
  return user;
};

// the user is our id since it must be unique.
const getUserByEmail = async (email) => {
  const user = await getUserById(email);
  return user;
};

const addUser = (user) => {
  const newUser = firebaseUsers.addUser(user);
  users.push(user);
};

const addSamples = () => {
  try {
    var json = fs.readFileSync("./uploads/sample_users.json", "utf-8");
    const usersArray = JSON.parse(json);
    let users = [];
    usersArray.forEach(async (user) => {
      const userId = await firebaseUsers.addUser(user);
      console.log("userId: ", userId);
    });
  } catch (error) {
    console.log("uses addSamples: ", error);
  }
};

const clearUsers = async () => {
  await firebaseUsers.deleteAll();
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  addSamples,
  clearUsers,
};
