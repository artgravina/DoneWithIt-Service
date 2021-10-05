const express = require("express");
const dotenv = require("dotenv");

// following will setup your process.env appropriately
// only requirement is to set .env file correctly
const initProcessEnv = () => {
  dotenv.config({ path: "./config/.env" }); // load env
  if (process.env.DEVELOPMENT_ENV) {
    dotenv.config({ path: "./config/development.env" });
    console.log("environment: ", "Development");
  }
  if (process.env.PRODUCTION_ENV) {
    dotenv.config({ path: "./config/production.env" });
    console.log("environment: ", "Production");
  }
  if (process.env.STAGING_ENV) {
    dotenv.config({ path: "./config/staging.env" });
    console.log("environment: ", "Staging");
  }
};

initProcessEnv();
require("./config/settings");

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
const usersStore = require("./store/users");
const helmet = require("helmet");
const compression = require("compression");
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

// make sure we always have our base users available. Will not add if already there.
const startup = async () => {
  await usersStore.addSamples();
  const port = process.env.PORT;
  app.listen(port, function () {
    console.log(`Server started at port: ${port}}....`);
    if (process.env.IS_JSON_SERVER) console.log("Json Server");
    if (process.env.IS_GCLOUD_SERVER) console.log("Gcloud Server");
  });
};

startup();
