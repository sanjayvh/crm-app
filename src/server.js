const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const serverConfig = require("./config/server.config");
const dbConfig = require("./config/db.config");

const mongoose = require("mongoose");
const User = require("./models/user.model");

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;

db.on("error", (err) => {
    console.log("Error connecting to Database: " + err.message);
});

db.once("open", () => {
    console.log("Connected to Database");
});

require("./routes/auth.routes")(app);

app.listen(serverConfig.PORT, (err) => {
    if (err) console.log(`Error listening on port ${serverConfig.PORT}`, err.message);
    else console.log(`App listening on port: ${serverConfig.PORT}`);
})