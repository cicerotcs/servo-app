const db = require("../db/connect");

class Random {
  static random = async () => {
    let sql =    
      "SELECT * FROM petrol_station WHERE id < 401 OFFSET floor(RANDOM() * 400) LIMIT 1;";
    try {
      const dbRes = await db.query(sql);
      return dbRes.rows;
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = Random;
