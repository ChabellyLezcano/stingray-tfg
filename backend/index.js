const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");

const { dbConnection } = require("./config/database");
const configureCloudinary = require("./config/cloudinary");

//Enviroment variables
require("dotenv").config();

// Express app
const app = express();

// Server http
const server = http.createServer(app);

// DB connection
dbConnection();

// Cloudinary connection
configureCloudinary();

// Middlewares
app.use(cors({ exposedHeaders: ["token"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/game", require("./routes/boardgame"));
app.use("/api/favorite", require("./routes/favorite"));
app.use("/api/reservation", require("./routes/reservation"));
app.use("/api/review", require("./routes/review"));
app.use("/api/recommendation", require("./routes/recommendation"));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
