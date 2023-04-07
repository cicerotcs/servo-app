const Stations = require("../models/stations");
const Random = require("../models/random");
const Bounds = require("../models/bounds");

const all = async (req, res) => {
  const data = await Stations.all();
  res.status(200).json(data);
};

const random = async (req, res) => {
  const data = await Random.random();
  res.status(200).json(data);
};

const bounds = async (req, res) => {
  const north = req.query.n;
  const south = req.query.s;
  const east = req.query.e;
  const west = req.query.w;
  const data = await Bounds.all(north, south, east, west);
  res.status(200).json(data);
};

const nearest = async (req, res) => {
  const { lat, lng, radius } = req.query;
  const data = await Stations.nearest(lat, lng, radius);
  res.status(200).json(data);
};

module.exports = { all, random, bounds, nearest };
