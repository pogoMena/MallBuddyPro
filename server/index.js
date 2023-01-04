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
  console.log("In getusers");
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

//Get all stores (For admin page)
app.get("/api/getallreviews", (req, res) => {
  console.log("from reviews");
  const sqlGet = "SELECT * FROM reviews";
  db.query(sqlGet, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getsubreviews", (req, res) => {
  console.log("from subreviews");
  const sqlGet = "SELECT * FROM subreviews";
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

app.post("/api/addquestion", (req, res) => {
  console.log("In addquestion");
  console.log(req.body);
  var question = req.body.question;
  var answer_type = parseInt(req.body.answer_type);
  var display = parseInt(req.body.display);

  const sqlInsert =
    "INSERT INTO questions (question, answer_type, display) VALUES (?, ?, ?)";

  db.query(sqlInsert, [question, answer_type, display], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/updatequestion", (req, res) => {
  console.log("In updatequestion");
  console.log(req.body);
  var question_id = req.body.question_id;
  var question = req.body.question;
  var answer_type = parseInt(req.body.answer_type);
  var display = parseInt(req.body.display);

  const sqlUpdate = `UPDATE questions
SET question = (?), answer_type = (?), display = (?)
WHERE question_id = (?)`;

  db.query(
    sqlUpdate,
    [question, answer_type, display, question_id],
    (err, result) => {
      console.log(result);
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
});

app.post("/api/updatereview", (req, res) => {
  console.log("\n\nIn updatereview");
  console.log(req.body);
  var review_id = req.body.review_id;
  var rating = req.body.rating;
  var review = req.body.review;
  var user_id = req.body.user_id;
  var store_id = req.body.store_id;
  var mall_id = req.body.mall_id;

  const sqlUpdate = `UPDATE reviews
SET rating = (?), review = (?), user_id = (?), store_id = (?), mall_id = (?)
WHERE review_id = (?)`;

  db.query(
    sqlUpdate,
    [rating, review, user_id, store_id, mall_id, review_id],
    (err, result) => {
      console.log(result);
      console.log(err);
      if (err) {
        res.send({ err: err });
      } else {
        res.send({ success: true });
      }
    }
  );
});

app.post("/api/updatemall", (req, res) => {
  console.log("In updatemall");
  console.log(req.body);
  var mall_id = req.body.mall_id;
  var mall_name = req.body.mallName;
  var mall_address = req.body.mallAddress;
  var mall_lat = req.body.mallLat;
  var mall_lng = req.body.mallLng;

  const sqlUpdate = `UPDATE malls
SET mall_name = (?), mall_address = (?), mall_lat = (?), mall_lng = (?)
WHERE mall_id = (?)`;

  db.query(
    sqlUpdate,
    [mall_name, mall_address, mall_lat, mall_lng, mall_id],
    (err, result) => {
      console.log(result);
      console.log(err);
      if (err) {
        res.send({ err: err });
      }else{
        res.send({success: true})
      }
    }
  );
});

app.post("/api/deleteuser", (req, res) => {
  console.log("In deleteuser");
  console.log(req.body);
  var user_id = req.body.user_id;

  const sqlDelete = `DELETE FROM users WHERE user_id = (?)`;

  db.query(sqlDelete, [user_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/deletemall", (req, res) => {
  console.log("In deletemall");
  console.log(req.body);
  var mall_id = req.body.mall_id;

  const sqlDelete = `DELETE FROM malls WHERE mall_id = (?)`;

  db.query(sqlDelete, [mall_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/deletestore", (req, res) => {
  console.log("In deletestore");
  console.log(req.body);
  var store_id = req.body.store_id;

  const sqlDelete = `DELETE FROM stores WHERE store_id = (?)`;

  db.query(sqlDelete, [store_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/deletereview", (req, res) => {
  console.log("\n\nIn deletereview");
  console.log(req.body);
  const review_id = req.body.review_id;

  const sqlDelete = `DELETE FROM reviews WHERE review_id = (?)`;

  db.query(sqlDelete, [review_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/deletequestion", (req, res) => {
  console.log("In deletequestion");
  console.log(req.body);
  var question_id = req.body.question_id;

  const sqlDelete = `DELETE FROM questions WHERE question_id = (?)`;

  db.query(sqlDelete, [question_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/deleteanswer", (req, res) => {
  console.log("In deleteanswer");
  console.log(req.body);
  var answer_id = req.body.answer_id;

  const sqlDelete = `DELETE FROM answers WHERE answer_id = (?)`;

  db.query(sqlDelete, [answer_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/deletesubcomment", (req, res) => {
  console.log("In deletesubcomment");
  console.log(req.body);
  var subreview_id = req.body.subreview_id;

  const sqlDelete = `DELETE FROM subreviews WHERE subreview_id = (?)`;

  db.query(sqlDelete, [subreview_id], (err, result) => {

    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/getreviewsubcomments", (req, res) => {
  console.log("\n\nIn getreviewsubcomments");
  console.log(req.body);
  var review_id = req.body.review_id;
  console.log(review_id);

  const sqlSelect = `SELECT subreviews.subreview_id, subreviews.subreview, users.username from subreviews
JOIN reviews on reviews.review_id=subreviews.review_id
JOIN users on subreviews.user_id = users.user_id
  WHERE subreviews.review_id=(?)`;

  db.query(sqlSelect, [review_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    }
    res.send(result);
  });
});
app.post("/api/userupdatereview", (req, res) => {
  console.log("In updatereview");
  console.log(req.body);
  var review_id = req.body.review_id;
  var rating = req.body.rating;
  var review = req.body.review;

  const sqlUpdate = `UPDATE reviews
SET rating = (?), review = (?)
WHERE review_id = (?)`;

  db.query(sqlUpdate, [rating, review, review_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/submitsubreview", (req, res) => {
  console.log("\n\nIn submitsubreview");
  console.log(req.body);
  var review_id = req.body.review_id;
  var subcomment = req.body.subcomment;
  var username = req.body.username;

  const sqlInsert = `INSERT INTO subreviews (subreview, review_id, user_id) values (?, ?, (SELECT user_id FROM users WHERE username = ?))`;

  db.query(sqlInsert, [subcomment, review_id, username], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send(result);
    }
  });
});

app.post("/api/addsubreview", (req, res) => {
  console.log("\n\nIn addsubreview");
  console.log(req.body);
  var review_id = req.body.review_id;
  var subcomment = req.body.subcomment;
  var user_id = req.body.user_id;

  const sqlSelect = `INSERT INTO subreviews (subreview, review_id, user_id) values (?, ?, ?)`;

  db.query(sqlSelect, [subcomment, review_id, user_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send(result);
    }
    
  });
});

app.post("/api/setfavoritemall", (req, res) => {
  console.log("In setfavoritemall");
  console.log(req.body);
  var username = req.body.userName;
  var mall_id = req.body.mall_id;

  const sqlUpdate = `UPDATE users
SET mall_id = (?)
WHERE username = (?)`;

  db.query(sqlUpdate, [mall_id, username], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    }
    res.send(result);
  });
});

app.post("/api/getusersfavoritemall", (req, res) => {
  console.log("\n\nIn getusersfavoritemall");
  console.log(req.body);
  var username = req.body.userName;
  console.log(username);

  const sqlSelect = `SELECT * from malls 
  WHERE mall_id=(SELECT mall_id FROM users WHERE username=(?))`;

  db.query(sqlSelect, [username], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    }
    res.send(result);
  });
});

app.post("/api/updatestore", (req, res) => {
  console.log("In updatestore");
  console.log(req.body);
  var store_id = req.body.store_id;
  var store_name = req.body.store_name;

  const sqlUpdate = `UPDATE stores
SET store_name = (?)
WHERE store_id = (?)`;

  db.query(sqlUpdate, [store_name, store_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/updatesubreview", (req, res) => {
  console.log("In updatesubreview");
  console.log(req.body);
  var subreview_id = req.body.subreview_id;
  var subreview = req.body.subreview;

  const sqlUpdate = `UPDATE subreviews
SET subreview = (?)
WHERE subreview_id = (?)`;

  db.query(sqlUpdate, [subreview, subreview_id], (err, result) => {
    console.log(result);
    console.log(err);
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/api/updatemall", (req, res) => {
  console.log("In updatemall");
  console.log(req.body);
  var mall_id = req.body.mall_id;
  var mall_name = req.body.mallName;
  var mall_address = req.body.mallAddress;
  var mall_lat = req.body.mallLat;
  var mall_lng = req.body.mallLng;

  const sqlUpdate = `UPDATE malls
SET mall_name = (?), mall_address = (?), mall_lat = (?), mall_lng = (?)
WHERE mall_id = (?)`;

  db.query(
    sqlUpdate,
    [mall_name, mall_address, mall_lat, mall_lng, mall_id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        res.send({ success: true });
      }
    }
  );
});

app.post("/api/updateanswer", (req, res) => {
  console.log("In updateanswer");
  console.log(req.body);
  var answer_id = req.body.answer_id;
  var radio_answer = req.body.radio_answer;
  var boolean_answer = req.body.boolean_answer;

  const sqlUpdate = `UPDATE answers
SET radio_answer = (?), boolean_answer = (?)
WHERE answer_id = (?)`;

  db.query(
    sqlUpdate,
    [radio_answer, boolean_answer, answer_id],
    (err, result) => {
      console.log(result);
      console.log(err);
      if (err) {
        res.send({ err: err });
      } else {
        res.send({ success: true });
      }
    }
  );
});

//Create new user (For signup page)
app.post("/api/createuser", (req, res) => {
  console.log("In createuser");
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

app.post("/api/adduser", (req, res) => {
  console.log("In adduser");
  console.log(req.body);
  const usernameRes = req.body.username;
  const passwordRes = req.body.password;
  const admin = req.body.admin;
  const email = req.body.email;

  const sqlInsert =
    "INSERT INTO users (username, password, email, admin) VALUES (?, ?, ?,?)";

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
        db.query(
          sqlInsert,
          [usernameRes, hash, email, admin],
          (err, result) => {
            res.send({ message: "User successfully inserted" });
          }
        );
      });
    } else {
      res.send({ message: "User already exists" });
    }
  });
});

app.post("/api/updateuser", (req, res) => {
  console.log("In updateuser");
  const user_id = req.body.user_id;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const admin = req.body.admin;

  const sqlUpdate = `UPDATE users
SET username = (?), password = (?), email= (?), admin= (?)
WHERE user_id = (?)`;

  console.log(req.body);

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      sqlUpdate,
      [username, hash, email, admin, user_id],
      (err, result) => {
        res.send({ message: "User update successful" });
      }
    );
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
  console.log("\n\nIn insertstores");
  const sqlInsert = "INSERT INTO stores (store_name) VALUES (?);";

  const sqlStores = "SELECT * FROM stores WHERE store_name = ?;";

  console.log("Length: " + req.body.stores.length);
  req.body.stores.forEach((element, index) => {
    db.query(sqlStores, element.name, (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      if (result.length == 0) {
        db.query(sqlInsert, element.name, (error, res) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
    
  });
  res.send({ success: true });
});
app.post("/api/insertstore", (req, res) => {
  console.log("\n\nIn insertstore");
  const sqlInsert = "INSERT INTO stores (store_name) VALUES (?);";
  const store_name = req.body.store_name;


  db.query(sqlInsert, store_name, (error, result) => {
    if (error) {
      res.send({err:error});
    }else{
    res.send({success: true})}
  });
});

app.post("/api/getmallid", (req, res) => {
  console.log("In getmallid");
  const selectMallID = `SELECT mall_id FROM malls WHERE mall_name = ?`;
  var mall_name = req.body.mall_name;

  db.query(selectMallID, mall_name, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/insertmall", (req, res) => {
  console.log("In insertmall");
  //const sqlInsert = "INSERT INTO malls (store_name) VALUES (?);";
  const mallInsert = `INSERT INTO malls (mall_name, mall_lat, mall_lng, mall_address)
SELECT * FROM (SELECT ? AS mall_name, ? AS mall_lat, ? AS mall_lng, ? AS mall_address) AS temp
WHERE NOT EXISTS (SELECT mall_name FROM malls WHERE mall_name = ?) LIMIT 1;`;

  var mall_name = req.body.mall.mall_name;
  var mall_lat = req.body.mall.mall_lat;
  var mall_lng = req.body.mall.mall_lng;
  var mall_address = req.body.mall.mall_address;

  db.query(
    mallInsert,
    [mall_name, mall_lat, mall_lng, mall_address, mall_name],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        res.send({ success: true });
      }
    }
  );
});

app.post("/api/addmall", (req, res) => {
  console.log("In addmall");
  const mallInsert = `INSERT INTO malls (mall_name, mall_lat, mall_lng, mall_address) VALUES(?,?,?,?);`

  var mall_name = req.body.mall_name;
  var mall_lat = req.body.mall_lat;
  var mall_lng = req.body.mall_lng;
  var mall_address = req.body.mall_address;

  db.query(
    mallInsert,
    [mall_name, mall_lat, mall_lng, mall_address],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ success: true });
      }
    }
  );
});

app.post("/api/getanswersforreview", (req, res) => {
  console.log("In getanswersforreview");
  const selectAnswers = `select * from answers where review_id=(?) order by question_id`;
  var review_id = req.body.review_id;

  db.query(selectAnswers, review_id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});


app.post("/api/updateanswersbyreview", (req, res) => {
  console.log("\n\nIn updateanswersbyreview");
  console.log(req.body);
  var answers = req.body.answers;
  var review_id = req.body.review_id;

  var responseSent = false;

  answers.forEach((answer) => {
    let sqlUpdate = ``;
    let sqlInsert = ``;
    if (answer.answer_type == 1) {
      console.log("its radio");

      sqlUpdate = `UPDATE answers
        SET radio_answer = (?)
        WHERE question_id = (?) AND review_id = (?)`;

      sqlInsert = `INSERT INTO ANSWERS (review_id, question_id, radio_answer) VALUES (?, ?, ?)`;
    } else if (answer.answer_type == 2) {
      console.log("its boolean");
      sqlUpdate = `UPDATE answers
        SET boolean_answer = (?)
        WHERE question_id = (?) AND review_id = (?)`;

      sqlInsert = `INSERT INTO ANSWERS (review_id, question_id, boolean_answer) VALUES (?, ?, ?)`;
    }

    console.log("review_id: " + review_id);
    console.log("question_id" + answer.question_id);

    db.query(
      sqlUpdate,
      [answer.answer, answer.question_id, review_id],
      (err, result) => {
        if (result.message.indexOf("Rows matched: 0") != -1) {
          console.log("No matches");
          db.query(
            sqlInsert,
            [review_id, answer.question_id, answer.answer],
            (err, resultb) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }

        if (err) {
          res.send({ err: err });
          responseSent = true;
        } else if (!responseSent) {
          res.send({ success: true });
          responseSent = true;
        }
      }
    );
  });
});


app.post("/api/getavganswer", async (req, res) => {
  console.log("In getavganswer");
  var length = req.body.stores.length;

  const sqlAvgForStore = `select AVG(reviews.rating) AS overallrating, AVG(answers.radio_answer) AS radio_answer, AVG(answers.boolean_answer) AS boolean_answer, answers.question_id, reviews.store_id, stores.store_name
from stores 
left join reviews on reviews.store_id = stores.store_id
left join answers on answers.review_id = reviews.review_id
WHERE stores.store_name = ?
GROUP BY reviews.store_id, answers.question_id
ORDER BY reviews.store_id, answers.question_id;`;

  let bar = new Promise((resolve, reject) => {
    var store_info = [];
    console.log("In promise");
    //console.log(req.body);
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

          store_info.push(tempAnswer);
        } else {
          console.log("It IS undefined");
          length--;
        }

        //if (index == req.body.stores.length - 1) {
        if (store_info.length == length) {
          resolve(store_info);
          reject("error");
        } else {
          console.log(store_info.length);
        }
      });
    });
  });

  bar.then(
    (store_info) => {
      res.send({ store_info: store_info });
      console.log("in the store avg");
    },
    (error) => {
      res.send({err:error});
    }
  );
});

//Recieves all reviews from a specific store
app.post("/api/getreviews", (req, res) => {
  console.log("In getreviews");
  const storeName = req.body.store;
  const sqlGet =
    "SELECT reviews.review_id, reviews.rating, reviews.review, users.username FROM reviews INNER JOIN users ON reviews.user_id=users.user_id WHERE store_id = (SELECT store_id FROM stores WHERE store_name=(?));";
  db.query(sqlGet, storeName, (err, result) => {
    res.send(result);
  });
});



/*
GETS AVERAGES/REVIEWS FOR SPECIFIC MALL
*/

app.post("/api/getavganswermallspecific", async (req, res) => {
  console.log("In getavganswer getMallspecific");

  const sqlAvgForStore = `SELECT stores.store_id AS store, AVG(reviews.rating) AS overallrating, AVG(answers.radio_answer) AS radio_answer, AVG(answers.boolean_answer) AS boolean_answer, answers.question_id, stores.store_name
FROM stores
LEFT JOIN (SELECT store_id FROM stores WHERE store_name = ?) AS selected_stores
  ON selected_stores.store_id = stores.store_id
LEFT JOIN reviews on reviews.store_id = stores.store_id AND reviews.mall_id = ?
LEFT JOIN answers on answers.review_id = reviews.review_id
LEFT JOIN malls on malls.mall_id = reviews.mall_id
WHERE stores.store_name = ?
GROUP BY reviews.store_id, answers.question_id
ORDER BY reviews.store_id, answers.question_id;
`;

  const mall_id = req.body.mall_id;
  var length = req.body.stores.length;

  let bar = new Promise((resolve, reject) => {
    var store_info = [];
    console.log("In promise");
    req.body.stores.forEach((element, index) => {
      db.query(
        sqlAvgForStore,
        [element.name, mall_id, element.name],
        (err, result) => {
          if (err) {
            res.send({ err: err });

            console.log(err);
          }
          console.log("\n\n" + element.name);
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
            store_info.push(tempAnswer);
          } else {
            console.log("It IS undefined");
            length--;
          }

          //if (index == req.body.stores.length - 1) {
          if (store_info.length == length) {
            resolve(store_info);
            reject("error");
          } else {
            console.log(store_info.length);
          }
        }
      );
    });
  });

  bar.then((store_info) => {
    res.send({ store_info: store_info });
    console.log("in the store avg");
  });
});

//Recieves all reviews from a specific store MALL SPECIFIC
app.post("/api/getreviewsmallspecific", (req, res) => {
  console.log("In getreviews mall specific");
  const storeName = req.body.store;
  const mall_id = req.body.mall_id;
  const sqlGet =
    "SELECT reviews.review_id, reviews.rating, reviews.review, users.username FROM reviews INNER JOIN users ON reviews.user_id=users.user_id WHERE store_id = (SELECT store_id FROM stores WHERE store_name=(?)) AND reviews.mall_id = (?);";
  db.query(sqlGet, [storeName, mall_id], (err, result) => {
    res.send(result);
  });
});

/*

*/

//Submits review for a specific store
app.post("/api/submitreview", (req, res) => {
  console.log(req.body);
  console.log("In submitreview");
  const review = req.body.review;
  const rating = req.body.rating;
  const storeName = req.body.store;
  const userName = req.body.userName;
  const mall_id = req.body.mall_id;
  const sqlInsert =
    "INSERT INTO reviews (rating,review,user_id,store_id,mall_id)VALUES ((?),(?),((SELECT user_id FROM users WHERE username=(?))),((SELECT store_id FROM stores WHERE store_name=(?))),(?));";
  db.query(
    sqlInsert,
    [rating, review, userName, storeName, mall_id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        res.send(result);
      }
    }
  );
});
app.post("/api/addreview", (req, res) => {
  console.log(req.body);
  console.log("In addreview");
  const review = req.body.review;
  const rating = req.body.rating;
  const store_id = req.body.store_id;
  const user_id = req.body.user_id;
  const mall_id = req.body.mall_id;
  const sqlInsert =
    "INSERT INTO reviews (rating,review,user_id,store_id,mall_id)VALUES ((?),(?),(?),(?),(?));";
  db.query(
    sqlInsert,
    [rating, review, user_id, store_id, mall_id],
    (err, result) => {
      
      if (err) {
        res.send({ err: err });
      } else {
        res.send(result);
      }
    }
  );
});
//Submits review for a specific store
app.post("/api/submitanswers", (req, res) => {
  console.log("\n\n\nIn submitanswers");
  console.log(req.body);
  const review_id = req.body.review_id;
  const answersArray = req.body.answers;
  if (review_id != null) {
    var question_id;
    var answer_type;
    var answer;
    var sqlInsert;
    console.log("Length: " + answersArray.length);
    for (var i = 0; i < answersArray.length; i++) {
      console.log("index: " + i);
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
        } else {
          console.log("There seems to be an issue here!");
        }

        db.query(sqlInsert, [question_id, review_id, answer], (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
    res.send({ success: true });
    console.log("all done");
  }
});

app.post("/api/addanswer", (req, res) => {
  console.log("\n\n\nIn addanswer");
  console.log(req.body);
  const radio_answer = req.body.radio_answer;
  const boolean_answer = req.body.boolean_answer;
  const question_id = req.body.question_id;
  const review_id = req.body.review_id;
  var answer;
  if (radio_answer != 0) {
    sqlInsert =
      "INSERT INTO answers (question_id,review_id,radio_answer)VALUES ((?),(?),(?));";
    answer = radio_answer;
  } else {
    sqlInsert =
      "INSERT INTO answers (question_id,review_id,boolean_answer)VALUES ((?),(?),(?));";
    answer = boolean_answer;
  }

  db.query(sqlInsert, [question_id, review_id, answer], (err, result) => {
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ success: true });
    }
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
