const db = require("../db/connect");

class Stats {
    static count = async () => {
        let sql = `select distinct owner , count(*) from petrol_station group by owner having count(*) >  1 order by 2 DESC;`
        const dbRes = await db.query(sql)
        return dbRes.rows;
    }

    static totalOwners = async () => {
        let sql = `select count( Distinct owner) from petrol_station;`
        const dbRes = await db.query(sql)
        return dbRes.rows[0].count;
    }

    static totalStations = async () => { // renamed function from totalOwners to totalStations
        let sql = `select count(*) from petrol_station;`
        const dbRes = await db.query(sql)
        return dbRes.rows[0].count;
    }

    static topStations = async () => {
        let sql = `select distinct owner , count(*) from petrol_station group by owner having count(*) >  1 order by 2 DESC LIMIT 7;`
        const dbRes = await db.query(sql)
        return dbRes.rows;
    }

    static async returnStats(){
        let obj = {}
        obj.owners = await this.count()
        obj.total_owners = await this.totalOwners()
        obj.total_stations = await this.totalStations()
        obj.top_stations = await this.topStations();
        return obj
    }
}
  
  module.exports = Stats;

