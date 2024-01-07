const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer');
const helmet = require("helmet");
const compression = require("compression");

// Routes
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

// Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for social posting app',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

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

// enabling the Helmet middleware for securing header
app.use(helmet());

// compressing assets except images
app.use(compression());

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

// middleware for swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// path configiration
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));


app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);


app.use((error, req, res, next) =>{
  console.log("error ",error);              // for developer insights
  const status = error?.statusCode || 500 ;
  const msg = error?.message;
  const data = error?.data;
  res.status(status).json({
    message: msg,
    data: data
  });
});


mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.l113ogc.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`
  )
  .then((result) => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected');
    });
  })
  .catch((error) => {
    console.log("Error ", error);
  });
