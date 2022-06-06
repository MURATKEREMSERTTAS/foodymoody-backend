const config =require("./package.json").projectonfig;

module.exports={
    mongoConfig:{
        connetUrl:"<DatabaseUrl>",
        dbName: "foodymoody",
        dbCollection: {
            USERS : "users",
            ORDERS: "orders"
        }
    },
    serverConfig:{
        port: config.port,
        ip: config.server,
    },
    tokenSecret: "foodymoody_secret"
}