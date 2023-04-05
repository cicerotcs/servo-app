const db = require("../db/connect");

class Stations {
  static all = async () => {
    let sql = "select * from petrol_station where id < 701";
    const dbRes = await db.query(sql);
    return dbRes.rows;
  };

  static proximity(lat1, lon1, lat2, lon2, radius) {
    const R = radius;
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const deltaP = p2 - p1;
    const deltaLon = lon2 - lon1;
    const deltaLambda = (deltaLon * Math.PI) / 180;
    const a =
      Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
      Math.cos(p1) *
        Math.cos(p2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R * 1000;
    return d;
  }

  static nearest = async (lat, lng, radius) => {
    const data = await this.all();
    const distances = [];

    data.forEach((item) => {
      const distance = this.proximity(
        lat,
        lng,
        item.latitude,
        item.longitude,
        radius
      );
      distances.push(distance);
    });

    const sortedIndices = distances
      .map((distance, index) => [distance, index])
      .sort(([distanceA], [distanceB]) => distanceA - distanceB)
      .slice(0, 10)
      .map(([_, index]) => index);

    return { sortedIndices, data, distances };
  };
}

module.exports = Stations;
