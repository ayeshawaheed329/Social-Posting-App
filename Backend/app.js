const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer');

// Routes
const feedRoutes = require("./routes/feed");

// Apps
const app = express();

// multer configuration for images
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date()?.toISOString()?.replace(/:/g, '-') + file?.originalname);
  }
});


// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use( multer({ storage: fileStorage }).single('image')); // multer for image/files data


// Header Configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// path configiration
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));


app.use("/feed", feedRoutes);

app.use((error, req, res, next) =>{
  console.log("error ",error);              // for developer insights
  const status = error?.statusCode || 500 ;
  const msg = error?.message;
  res.status(status).json({
    message: msg
  });
});


mongoose
  .connect(
    "MONGO DB CONNECTION URL"
  )
  .then((result) => {
    console.log("Database is connected.");
    app.listen(8080);
  })
  .catch((error) => {
    console.log("Error ", error);
  });
