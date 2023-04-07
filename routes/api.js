const express = require("express");
const { all, random, bounds, nearest } = require("../controllers/stations");
const owners = require("../controllers/owners");
const stats = require("../controllers/stats");

const router = express.Router();

router.get("/stations/all", all);
router.get("/stations/random", random);
router.get("/stations/bounds", bounds);
router.get("/stations/nearest", nearest);
router.get("/owners", owners);
router.get("/stats", stats);

module.exports = router;
