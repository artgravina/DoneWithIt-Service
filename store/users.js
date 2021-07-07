var fs = require("fs");
const firebaseUsers = require("../store/services/firebaseUsers");

const users = [
  {
    id: 1,
    name: "Mosh",
    email: "mosh@domain.com",
    password: "12345",
  },
  {
    id: 2,
    name: "John",
    email: "john@domain.com",
    password: "12345",
  },
];

const getUsers = () => users;

const getUserById = (id) => users.find((user) => user.id === id);

const getUserByEmail = (email) => users.find((user) => user.email === email);

const addUser = (user) => {
  user.id = users.length + 1;
  users.push(user);
};

const addSamples = () => {
  var json = fs.readFileSync("./sample_users.json", "utf-8");
  const usersArray = JSON.parse(json);
  usersArray.forEach(async (user) => {
    const userId = await firebaseUsers.addUser(user);
    console.log("userId: ", userId);
  });
};

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
  addSamples,
};
