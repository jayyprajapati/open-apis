const mongoose = require("mongoose");
require("dotenv").config();
const mongoUserName = process.env.MONGODB_USERNAME;
const mongoUserPassword = process.env.MONGODB_PASSWORD;
const mongoAppName = process.env.MONGODB_APPNAME;
const mongoURI = `mongodb+srv://${mongoUserName}:${mongoUserPassword}@${mongoAppName}.bj7dm.mongodb.net/?retryWrites=true&w=majority&appName=${mongoAppName}`;

mongoose.set('strictQuery', true);

const connectToMongo = () => {
  mongoose.connect(mongoURI, (err) => {
    if (err) console.log(err);
    else console.log("Connected to Mongo");
  });
};

module.exports = connectToMongo;
