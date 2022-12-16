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
app.get("/api/getusers", (req, res) => {
  const sqlGet = "SELECT * FROM users";
  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});

//Get all malls (For admin page)
app.get("/api/getmalls", (req, res) => {
    console.log("from malls");
  const sqlGet = "SELECT * FROM malls";
  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});
//Get all stores (For admin page)
app.get("/api/getstores", (req, res) => {
    console.log("from stores");
  const sqlGet = "SELECT * FROM stores";
  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});

//Get all questions (For admin page/and itemsearch page)
app.get("/api/getquestions", (req, res) => {
    console.log("from questions");
  const sqlGet = "SELECT * from questions ORDER BY answer_type;";
  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});
//Get all answers (For admin page)
app.get("/api/getanswers", (req, res) => {
    console.log("from answers");
  const sqlGet = "SELECT * FROM answers";
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

  const sqlStores = "SELECT * FROM stores WHERE store_name = ?;";

  req.body.stores.forEach((element) => {
    db.query(sqlStores, element.name, (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length == 0) {
        db.query(sqlInsert, element.name, (error, res) => {
          if (err) {
            console.log(error);
          }
        });
      }
    });
  });
});

app.post("/api/getavganswer", async (req, res) => {
  console.log("attempting");
  
  const sqlAvgForStore = `select AVG(reviews.rating) AS overallrating, AVG(answers.radio_answer) AS radio_answer, AVG(answers.boolean_answer) AS boolean_answer, answers.question_id, reviews.store_id, stores.store_name
from stores 
left join reviews on reviews.store_id = stores.store_id
left join answers on answers.review_id = reviews.review_id
WHERE stores.store_name = ?
GROUP BY reviews.store_id, answers.question_id
ORDER BY reviews.store_id, answers.question_id;`;

  let bar = new Promise((resolve, reject) => {
    var store_info = [];
    req.body.stores.forEach((element, index) => {
      db.query(sqlAvgForStore, element.name, (err, result) => {
        if (err) {
          res.send({ err: err });
          console.log(err);
        }

        if (result[0] != undefined) {
          let tempAnswer = {
            store_name: result[0].store_name,
            store_id: result[0].store_id,
            rating: result[0].overallrating,
            answers: [],
          };

          for (var i = 0; i < result.length; i++) {
            tempAnswer.answers.push({
              question_id: result[i].question_id,
              radio_answer: result[i].radio_answer,
              boolean_answer: result[i].boolean_answer,
            });
          }
          //console.log(tempAnswer.answers);
          store_info.push(tempAnswer);
        }
        //if (index == req.body.stores.length - 1) {
        if (store_info.length == req.body.stores.length) {
          //console.log("in if statement index: " + index);
          //console.log("in if statement length: " + req.body.stores.length);
          resolve(store_info);
          reject("error");
        }

        //console.log("Outside if statement index: " + index);
        //console.log("Outside if statement length: " + req.body.stores.length);
      });
      
    });
  });

  bar.then((store_info) => {
    res.send({ store_info: store_info });
  });
});

//Recieves all reviews from a specific store
app.post("/api/getreviews", (req, res) => {
  const storeName = req.body.store;
  const sqlGet =
    "SELECT reviews.review_id, reviews.rating, reviews.review, users.username FROM reviews INNER JOIN users ON reviews.user_id=users.user_id WHERE store_id = (SELECT store_id FROM stores WHERE store_name=(?));";
  db.query(sqlGet, storeName, (err, result) => {
    res.send(result);
  });
});

app.post("/api/getstoreaverages", (req, res) => {
  const storeName = req.body.store;
  const sqlGet =
    "SELECT reviews.review_id, reviews.rating, reviews.review, users.username FROM reviews INNER JOIN users ON reviews.user_id=users.user_id WHERE store_id = (SELECT store_id FROM stores WHERE store_name=(?));";
  db.query(sqlGet, storeName, (err, result) => {
    res.send(result);
  });
});

//Submits review for a specific store
app.post("/api/submitreview", (req, res) => {
  const review = req.body.review;
  const rating = req.body.rating;
  const storeName = req.body.store;
  const userName = req.body.userName;
  const sqlInsert =
    "INSERT INTO reviews (rating,review,user_id,store_id)VALUES ((?),(?),((SELECT user_id FROM users WHERE username=(?))),((SELECT store_id FROM stores WHERE store_name=(?))));";
  db.query(sqlInsert, [rating, review, userName, storeName], (err, result) => {
    res.send(result);
  });
});

//Submits review for a specific store
app.post("/api/submitanswers", (req, res) => {
  const review_id = req.body.review_id;
  const answersArray = req.body.answers;
  if (review_id != null) {
    var question_id;
    var answer_type;
    var answer;
    var sqlInsert;
    for (var i = 0; i < answersArray.length; i++) {
      
      question_id = answersArray[i].question_id;
      answer_type = answersArray[i].answer_type;
      answer = answersArray[i].answer;
      if (
        answer_type === 2 ||
        (answer_type === 1 && answer !== 0) ||
        (answer_type === 0 && answer !== "")
      ) {
        if (answer_type == 0) {
          sqlInsert =
            "INSERT INTO answers (question_id,review_id,text_answer)VALUES ((?),(?),(?));";
        } else if (answer_type == 1) {
          answer = parseInt(answer);
          sqlInsert =
            "INSERT INTO answers (question_id,review_id,radio_answer)VALUES ((?),(?),(?));";
        } else if (answer_type == 2) {
          answer = parseInt(answer);
          sqlInsert =
            "INSERT INTO answers (question_id,review_id,boolean_answer)VALUES ((?),(?),(?));";
        }

        db.query(sqlInsert, [question_id, review_id, answer], (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  }

});



app.listen(3001, () => {
  console.log("running on port 3001");
});
