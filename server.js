const express = require("express");
const db = require("./db/connect");
const Stations = require("./models/stations");
const Owners = require("./models/owners");
const Random = require("./models/random");
const Stats = require("./models/stats");
const Bounds = require("./models/bounds");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.locals.stations = {};
  const statsData = await Stats.returnStats(); // call the returnStats function to get the data
  res.render("index", { apiKey: process.env.MAPS_API_KEY, stats: statsData });
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
  res.json(data);
});
app.get("/api/stats", async (req, res) => {
  const data = await Stats.returnStats();
  res.json(data);
});

app.get(`/api/stations/bounds`, async (req, res) => {
  const north = req.query.n;
  const south = req.query.s;
  const east = req.query.e;
  const west = req.query.w;
  const data = await Bounds.all(north, south, east, west);
  res.json(data);
});

app.get(`/keys/commodity`, async (req, res) => {
  res.json({ commodityKey: process.env.COMMODITIES_API_KEY });
});

app.get("/api/nearest", async (req, res) => {
  const { lat, lng, radius } = req.query;
  const data = await Stations.nearest(lat, lng, radius);
  res.json(data);
});

app.get(`/keys/googleMap`, async (req, res) => {
  res.json({googleMapKey: process.env.MAPS_API_KEY})
})



const port = process.env.PORT || 8080;

async function init() {
  await db.connect();
  app.listen(port, console.log(`Server running on port ${port}`));
}

init();
