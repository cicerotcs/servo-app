const commodity = async (req, res) => {
  res.status(200).json({ commodityKey: process.env.COMMODITIES_API_KEY });
};

const googleMap = async (req, res) => {
  res.status(200).json({ googleMapKey: process.env.MAPS_API_KEY });
};

module.exports = { commodity, googleMap };
