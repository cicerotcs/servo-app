const express = require("express");
const { commodity, googleMap } = require("../controllers/keys");

const router = express.Router();

router.get("/commodity", commodity);
router.get("/googleMap", googleMap);

module.exports = router;
