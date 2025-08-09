const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const ScheduledJobs = require('./services/scheduledJobs');
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
  res.send("Hello! This is just a home route. The endpoints available are:\n /api/connect\n /api/notifications");
});

app.use("/api/connect", require("./Routes/messages"));
app.use("/api/notifications", require("./Routes/notifications"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
  // Initialize and start scheduled jobs
  const jobService = new ScheduledJobs();
  jobService.startScheduledJobs();
  
  console.log('Portfolio notification system is ready!');
});
