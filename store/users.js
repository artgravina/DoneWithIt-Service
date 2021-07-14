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
  const user = await firebaseUsers.getUserByEmail(email);
  return user;
};

const addUser = (user) => {
  const newUser = firebaseUsers.addUser(user);
  users.push(user);
};

const addUserSamples = async (usersArray) => {
  for (const index in usersArray) {
    const user = usersArray[index];
    const userFound = await firebaseUsers.getUserByEmail(user.email);
    if (!userFound) {
      const newuser = await firebaseUsers.addUser(user);
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
