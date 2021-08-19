const fs = require("fs");
const express = require("express");
const app = express();
require("dotenv").config();

const axios = require("axios");

const port = 5000;
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const verify_jwt = require("./jwt_verify.js");

//Here we are configuring express to use body-parser as middle-ware.

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoose = require("mongoose");
const jwt_verify = require("./jwt_verify.js");

const goodURLS = ["http://localhost:5000"];

const mongoString = process.env.MONGO_DB_CONNECT_STRING;

mongoose.connect(mongoString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const userSchema = new mongoose.Schema({
  user_id: Number,
  posts: [
    {
      title: String,
      body: String,
      // upvotes: Number,
      // downvotes: Number,
      date: Date,
      replies: [
        {
          title: String,
          body: String,
          // upvotes: Number,
          // downvotes: Number,
          date: Date,
        },
      ],
    },
  ],
});

const postSchema = new mongoose.Schema({
  body: String,
  poster_id: Number,
  username: String,
  upvotes: [Number],
  downvotes: [Number],
  date: { type: Date, default: Date.now },
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected");
});

const postData = mongoose.model("postdata", postSchema);

const userData = mongoose.model("userdata", userSchema);

app.post("/new/user", async (req, res) => {
  const id = verify_jwt(req.body.headers.id.data);
  if (!id) {
    res.status(404).send("Invalid JWT Token");
  }
  console.log(id);
  try {
    //console.log('trying now')
    const data = await userData.find({ user_id: id });
    //console.log(data);
    if (data.length === 0) {
      const newUserData = new userData({
        user_id: id,
        posts: [{}],
      });

      await newUserData.save((err) => {
        res.send("User has been added successfully");
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/new/post", async (req, res) => {
  let id;
  try {
    id = jwt.verify(req.body.headers.data.toString(), process.env.JWT_KEY).data
      .jwt_id;
  } catch (err) {
    res.status(404).send("Invalid JWT Token");
  }

  if (req.body.headers.body.length > 500) {
    res.status(500).send("Message body too long");
  }

  //console.log(req.body);
  try {
    const username = await axios.get(`https://api.github.com/user/${id}`);
    const newPostData = new postData({
      body: req.body.headers.body,
      poster_id: id,
      username: username.data.login,
    });

    await newPostData.save((err) => {
      if (err) {
        console.log(err);
      }
      console.log("Post added!");
      res.send("Post has been added successfully");
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.post("/jwt_auth", (req, res) => {
  if (goodURLS.indexOf(req.get("origin")) < 0) {
    res.status(400).send("Request not coming from certified URLs!");
    console.log(req.get("origin"));
  } else {
    const req_data = req.body.headers.data;

    res.send(jwt.sign({ data: req_data }, process.env.JWT_KEY));
  }
});

app.post("/get/user", async function (req, res) {
  try {
    const user_id = req.body.headers.id;
    const data = await userData.find({ user_id: user_id });

    if (data.length === 0) {
      res.status(404).send("User not found");
      return;
    }

    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/add/upvote", async function (req, res) {
  let id = null;
  try {
    id = jwt.verify(req.body.headers.data.data.toString(), process.env.JWT_KEY)
      .data.jwt_id;
  } catch (err) {
    res.status(404).send("Invalid JWT Token");
  }

  const checkUpvotes = await postData.find({ _id: req.body.headers.post_id });

  if (checkUpvotes[0].upvotes.includes(id)) {
    // do something here
    res.status(409).send("Upvote already exists");
  } else {
    let new_upvotes = checkUpvotes[0].upvotes;
    new_upvotes.push(id);
    await postData.updateOne(
      { _id: req.body.headers.post_id },
      { upvotes: new_upvotes }
    );
    console.log("upvote added");
    const send_data = await postData.find({ _id: req.body.headers.post_id });

    res.json(send_data[0].upvotes);
  }
});

app.get("/get/posts", async function (req, res) {
  try {
    const data = await postData.find({});

    console.log(data);

    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:user/posts", async function (req, res) {
  try {
    const username = await axios.get(
      `https://api.github.com/users/${req.params.user}`
    );
    const data = await postData.find({ user_id: username.id });

    console.log(data);

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(404).status("Invalid Username");
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
