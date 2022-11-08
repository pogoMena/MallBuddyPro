const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const cors = require("cors");
const app = express();
const mysql = require("mysql");
const asyncHandler = require("express-async-handler");

//Hashing
const bcrypt = require("bcrypt");
const saltRounds = 10;

//Database connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  port: 3305,
  database: "cruddatabase",
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "id", //this is probable wrong
    secret: "secret", //I need to change this
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24, //expires in 24 hours
    },
  })
);

//Get all users (For admin page)
app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM users";
  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});

//Create new user (For signup page)
app.post("/api/createuser", (req, res) => {
  const usernameRes = req.body.username;
  const passwordRes = req.body.password;
  const email = req.body.email;

  const sqlInsert =
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";

  const sqlLogin = "SELECT * FROM users WHERE username = ?;";
  db.query(sqlLogin, usernameRes, (err, result) => {
    if (err) {
      res.send({ err: err });
    }

    if (result.length == 0) {
      bcrypt.hash(passwordRes, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
        }
        db.query(sqlInsert, [usernameRes, hash, email], (err, result) => {
          res.send({ message: "User successfully inserted" });
        });
      });
    } else {
      res.send({ message: "User already exists" });
    }
  });
});

//Login (For login page)
app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sqlLogin = "SELECT * FROM users WHERE username = ?;";
  db.query(sqlLogin, username, (err, result) => {
    if (err) {
      res.send({ err: err });
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          req.session.user = result;
          console.log(req.session.user);
          res.send(result);
        } else {
          res.send({ message: "Wrong username/password combo" });
        }
      });
    } else {
      res.send({ message: "User doesnt exist" });
    }
  });
});

//Checks if user is logged in
app.get("/api/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

//Logs out
app.post("/api/logout", (req, res) => {
  delete req.session.user;
  res.send({ loggedIn: false });
});

app.post("/api/insertstores", (req, res) => {
  const sqlInsert = "INSERT INTO stores (store_name) VALUES (?);";

  const sqlLogin = "SELECT * FROM stores WHERE store_name = ?;";

  req.body.stores.forEach((element) => {
    db.query(sqlLogin, element.name, (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length == 0) {
        db.query(sqlInsert, element.name, (err, result) => {
          console.log(res)
        });
        console.log(element.name);
      }
    });
  });
});

app.post("/api/getreviews", (req, res) => {
    const storeName = req.body.store;
  const sqlGet = "SELECT reviews.review_id, reviews.rating, reviews.review, users.username FROM reviews INNER JOIN users ON reviews.user_id=users.user_id WHERE store_id = (SELECT store_id FROM stores WHERE store_name=(?));";
  db.query(sqlGet, storeName, (err, result) => {
    res.send(result);
  });
});

/*
THIS IS MY NEXT STEP

*/
app.post("/api/submitreview", (req, res) => {
  console.log(req.body);
  const review = req.body.review
  const rating = req.body.rating
  const storeName = req.body.store;
  const userName = req.body.userName;
  const sqlInsert ="INSERT INTO reviews (rating,review,user_id,store_id)VALUES ((?),(?),((SELECT user_id FROM users WHERE username=(?))),((SELECT store_id FROM stores WHERE store_name=(?))));";
  db.query(sqlInsert, [rating, review, userName, storeName], (err, result) => {
    res.send(result);
    console.log(result);
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
