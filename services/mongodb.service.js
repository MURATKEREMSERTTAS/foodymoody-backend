const { MongoClient } = require("mongodb");
const { mongoConfig } = require("../config");

class MongoDB {
    static connect =()=> {
        MongoClient.connect(mongoConfig.connetUrl)
        .then((connection)=>{
            console.log("MongoDB connected");
            this.db = connection.db(mongoConfig.dbName);
        })
        .catch((err)=>{
            console.log("MongoDB connection error", err);
        });
    }
}
MongoDB.db = null;

module.exports = MongoDB;