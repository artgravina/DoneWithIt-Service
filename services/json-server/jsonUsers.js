const fs = require("fs");
const uuid = require("react-uuid");

const dataPath = "./data/users.json";
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

async function addUser(user) {
  try {
    const data = await readFile(dataPath);
    user.updated = new Date().toJSON();
    user.id = uuid();
    data.push(user);

    await writeFile(dataPath, data);
    return user;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function getUser(userId) {
  try {
    const data = await readFile(dataPath);
    const user = data.find((user) => user.id === userId);
    console.log(user);
    return user;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function getUsers() {
  try {
    const data = await readFile(dataPath);
    console.log("data: ", data);
    return data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

async function getUserByEmail(email) {
  try {
    const data = await readFile(dataPath);
    const user = data.find((user) => user.email === email);
    console.log(user);
    return user;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function deleteUser(userId) {
  try {
    const data = await readFile(dataPath);
    const newdata = data.filter((user) => user.id !== userId);
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

async function updateUser(user) {
  try {
    const data = await readFile(dataPath);
    const index = data.findIndex((element) => element.id === user.id);
    if (index !== -1) {
      user.updated = new Date().toJSON();
      data[index] = user;
      await writeFile(dataPath, data);
    }
  } catch (error) {
    console.error(error.message);
  }
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

module.exports = {
  addUser,
  getUser,
  getUsers,
  getUserByEmail,
  deleteUser,
  deleteAll,
  updateUser,
};
