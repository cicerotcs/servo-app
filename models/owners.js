const db = require("../db/connect");

class Owners {
  static owners = async () => {
    let sql =
      "select distinct on(owner) owner from petrol_station order by owner, id;";
    try {
      const dbRes = await db.query(sql);
      return dbRes.rows;
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = Owners;
