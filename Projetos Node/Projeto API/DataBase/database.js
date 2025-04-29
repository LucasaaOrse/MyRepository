const Sequelize = require("sequelize")

const connection = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",  // Arquivo do banco SQLite
    logging: false              // Desativa logs no console
    
})

module.exports = connection