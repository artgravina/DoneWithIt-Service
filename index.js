const express = require("express");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const listing = require("./routes/listing");
const users = require("./routes/users");
const user = require("./routes/user");
const auth = require("./routes/auth");
const my = require("./routes/my");
const messages = require("./routes/messages");
const expoPushTokens = require("./routes/expoPushTokens");
const test = require("./routes/testing");
const loadSamples = require("./routes/loadSamples");
const userStore = require("./store/users");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use("/api/categories", categories);
app.use("/api/listing", listing);
app.use("/api/listings", listings);
app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/my/listings", my);
app.use("/api/expoPushTokens", expoPushTokens);
app.use("/api/messages", messages);
app.use("/api/initialize", loadSamples);
app.use("/test", test);

const port = process.env.PORT || config.get("port");

// make sure we always have our base users available. Will not add if already there.
const startup = async () => {
  await userStore.addSamples();
  app.listen(port, function () {
    console.log(`Server started on port ${port}...`);
    console.log(config.get("imagesBaseUrl"));
  });
};

startup();
