const db = require("../db/connect");

class Bounds {
  static all = async (north, south, east, west) => {
    let sql = "SELECT * FROM petrol_station WHERE id < 401 AND latitude < $1 AND latitude > $2 AND longitude < $3 AND longitude > $4";
    const dbRes = await db.query(sql, [north, south, east, west]);
    return dbRes.rows;
  };
}

module.exports = Bounds;