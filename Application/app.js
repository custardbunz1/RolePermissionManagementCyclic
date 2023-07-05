// Dependencies and imports
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const connectToDb = require('./config/dbConnection');
const expressSession = require("express-session");

const Role = require("./models/Role");
const User = require("./models/User")
const roleController = require("./controllers/role")
const userController = require("./controllers/user")

app.set("view engine", "ejs");

//Middleware to process outgoing HTTP requests
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get port and connection string from .env file
const { WEB_PORT, MONGODB_URI } = process.env;

// Connect to MongoDB
connectToDb();

// Connect to Mongoose
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// If there is an error with Mongoose, the error will display on the console and the connection will close
mongoose.connection.on("error", (err) => {
  console.error(err);
  process.exit();
});

// Images and CSS are stored in 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Set cookie session
app.use(expressSession({ secret: 'secret cookie', cookie: { expires: new Date(253402300000000) } }))

// Manages logged in user
global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

// Login screen displays on start up
app.get("/", (req, res) => {
  res.render('index', { errors: {} })
});
app.post("/", userController.login);

// Obtains all roles in the roles collection
// Sends content from role.js controller to the server, displayed on allRoles.ejs
app.get("/roles", roleController.list);

// Deletes a role with the matching ID
app.get("/roles/delete/:id", authMiddleware, roleController.delete);

// Creates a new role
app.post("/create", roleController.create)
app.get("/create", authMiddleware, (req, res) => res.render("createRole"));

// Updates a role with the matching ID
app.get("/roles/update/:id", authMiddleware, roleController.edit);
app.post("/roles/update/:id", authMiddleware, roleController.update);

// Displays all admin roles
app.get("/admin", roleController.findAdmin);

// Displays all controller roles
app.get("/controller", roleController.findController);

// Displays all monitoring roles
app.get("/monitoring", roleController.findMonitoring);

// Displays all planner roles
app.get("/planner", roleController.findPlanner);

// Register a new user
app.get("/register", (req, res) => {
  res.render('createUser', { errors: {} })
});
app.post("/register", userController.create);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})
app.get("/roles/update/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})

// Listens at local host port 3000 and logs to console if Mongoose is connected 
mongoose.connection.once('open', () => {
  app.listen(WEB_PORT, () => {
    console.log(`App listening at http://localhost:${WEB_PORT}`);
  });
});