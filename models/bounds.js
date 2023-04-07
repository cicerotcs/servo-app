const db = require("../db/connect");
const BadRequestError = require("../errors/bad-request");

class Bounds {
  static all = async (north, south, east, west) => {
    let sql =
      "SELECT * FROM petrol_station WHERE id < 701 AND latitude < $1 AND latitude > $2 AND longitude < $3 AND longitude > $4";
    const dbRes = await db.query(sql, [north, south, east, west]);
    // if (dbRes.rows.length === 0) {
    //   throw new BadRequestError("The values are out of range.");
    // }
    return dbRes.rows;
  };
}

module.exports = Bounds;
