const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();

connectToMongo();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send("Hello! This is just a home route. The endpoints available are:\n /api/connect");
});

app.use("/api/connect", require("./Routes/messages"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});