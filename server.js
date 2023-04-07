const express = require("express");
const db = require("./db/connect");
const Stats = require("./models/stats");
const apiRouter = require("./routes/api");
const keysRouter = require("./routes/keys");
const errorHandler = require("./middlewares/errorHandler");
require("express-async-errors");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const statsData = await Stats.returnStats(); // call the returnStats function to get the data
  res.render("index", { apiKey: process.env.MAPS_API_KEY, stats: statsData });
});

app.use("/api", apiRouter);
app.use("/keys", keysRouter);

app.use(errorHandler);

const port = process.env.PORT || 8080;

async function init() {
  await db.connect();
  app.listen(port, console.log(`Server running on port ${port}`));
}

init();
