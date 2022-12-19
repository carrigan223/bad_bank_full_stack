const express = require("express");
const connection = require("./db/conn");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./db/models/userModel");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

//route to initialize a user
app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      total_balance: 0,
      checking_balance: 0,
      savings_balance: 0,
      created_at: new Date(),
      last_login: new Date(),
      transactions: [],
    });
    res.json(
      {
        message: "User created",
        user: user,
      },
      200
    );
  } catch (err) {
    return res.json({
      message: "Error",
      error: err,
    });
  }
});

//route to login a user and return the user object after verifying the password is correct
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({
      email: email,
    });
    console.log(password);
    console.log(user.password);
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        //create a token and return it to the user as a bearer token
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.TOKEN_SECRET
        );
        res.header("auth-token", token);

        res.json({
          message: "Success",
          user: user,
        });
      } else {
        res.json({
          message: "Error",
          error: "Invalid password",
        });
      }
    } else {
      res.json({
        message: "Error",
        error: "User not found",
      });
    }
  } catch (err) {
    return res.json({
      message: "Error",
      error: err,
    });
  }
});

//get a list of all users
app.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.json({
        message: "Error",
        error: err,
      });
    } else {
      res.json({
        message: "Success",
        users: users,
      });
    }
  });
});

//get a specific user based on the header token
app.get("/user", (req, res) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.json({
      message: "Error",
      error: "Access denied",
    });
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    User.findOne(
      {
        _id: verified.id,
      },
      (err, user) => {
        if (err) {
          res.json({
            message: "Error",
            error: err,
          });
        } else {
          res.json({
            message: "Success",
            user: user,
          });
        }
      }
    );
  } catch (err) {
    res.json({
      message: "Error",
      error: "Invalid token",
    });
  }
});

app.listen(process.env.port || 4000, function () {
  console.log("Server is running on port 4000");
});
