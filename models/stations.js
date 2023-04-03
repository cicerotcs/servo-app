const db = require("../db/connect");

class Stations {
  static all = async () => {
    let sql = "select * from petrol_station where id < 401";
    const dbRes = await db.query(sql);
    return dbRes.rows;
  };
}

module.exports = Stations;
