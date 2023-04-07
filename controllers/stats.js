const Stats = require("../models/stats");

const stats = async (req, res) => {
  const data = await Stats.returnStats();
  res.status(200).json(data);
};

module.exports = stats;
