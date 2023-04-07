const db = require("../db/connect");
const NotFoundError = require("../errors/not-found");
class Random {
  static random = async () => {
    let sql =
      "SELECT * FROM petrol_station WHERE id < 701 OFFSET floor(RANDOM() * 700) LIMIT 1;";
    const dbRes = await db.query(sql);
    if (dbRes.rows.length === 0) {
      throw new NotFoundError("Station not found while generating random");
    }
    return dbRes.rows[0];
  };
}

module.exports = Random;
