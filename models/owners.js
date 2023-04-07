const db = require("../db/connect");
const NotFoundError = require("../errors/not-found");

class Owners {
  static owners = async () => {
    let sql =
      "select distinct on(owner) owner from petrol_station order by owner, id;";
    const dbRes = await db.query(sql);
    if (dbRes.rows.length === 0) {
      throw new NotFoundError("Owners not found");
    }
    return dbRes.rows;
  };
}

module.exports = Owners;
