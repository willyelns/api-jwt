const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("errorhandler");
const requireDir = require("require-dir");

const PATH = 3001;
const HOST = "0.0.0.0";

mongoose.promise = global.Promise;

const isPrd = process.env.NODE_ENV === "production";

const app = express();

app.use(cors());
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "passport-tutorial",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isPrd) {
  app.use(errorHandler());
}

mongoose.connect(
  "mongodb://localhost:27017/mealwallet",
  { useNewUrlParser: true }
);
mongoose.set("debug", true);

requireDir("./src/models/");
requireDir("./src/config/");
app.use(require("./src/routes"));

// if (!isPrd) {
//   app.use((err, req, res) => {
//     res.status(err.status || 500);
//     res.json({
//       errors: {
//         message: err.message,
//         error: err
//       }
//     });
//   });

//   app.use((err, req, res) => {
//     res.status(err.status || 500);
//     res.json({
//       errors: {
//         message: err.message,
//         error: {}
//       }
//     });
//   });
// }

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.listen(PATH, HOST, () => {
  console.log(`Server running on http://localhost:${PATH}/`);
});
