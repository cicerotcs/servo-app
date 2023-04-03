const fs = require("fs");
const db = require("./db/connect");

db.connect();

const { parse } = require("csv-parse");

let sql =
  "INSERT INTO petrol_station(object_id, feature_type, description, class, fid, name, operational_status, owner, industry_id, address, suburb, state, spatial_confidence, revised, comment, latitude, longitude) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17);";

fs.createReadStream("./public/petrolstations.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", (row) => {
    row = row.map((item) => {
      return item === "" ? null : item;
    });
    db.query(sql, row, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Inserted row`);
      }
    });
  });
