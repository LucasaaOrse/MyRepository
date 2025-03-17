var knex = require("knex")({
    client: "mysql2",
    connection:{
        host: "localhost",
        user:   "root",
        password: "Titico123!",
        database: "knexjs"
    }
})

module.exports = knex