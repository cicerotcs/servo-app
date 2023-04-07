const Owners = require("../models/owners");

const owners = async (req, res) => {
  const data = await Owners.owners();
  res.status(200).json(data);
};

module.exports = owners;
