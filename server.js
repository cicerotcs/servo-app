const express = require("express");
const db = require("./db/connect");
const Stations = require("./models/stations");
const Owners = require("./models/owners");
const Random = require("./models/random");
const Stats = require("./models/stats");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { apiKey: process.env.MAPS_API_KEY });
});

app.get("/api/stations/all", async (req, res) => {
  const data = await Stations.all();
  res.json(data);
});

app.get("/api/owners", async (req, res) => {
  const data = await Owners.owners();
  res.json(data);
});

app.get(`/api/stations/random`, async (req, res) => {
  const data = await Random.random();
  res.json(data)
})
app.get("/api/stats", async (req, res) => {
  const data = await Stats.returnStats();
  res.json(data);
});

const port = process.env.PORT || 8080;

async function init() {
  await db.connect();
  app.listen(port, console.log(`Server running on port ${port}`));
}

init();
