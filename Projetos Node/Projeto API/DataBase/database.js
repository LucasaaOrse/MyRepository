const Sequelize = require("sequelize")

const connection = new Sequelize("guiaapi","root","Titico123!",{
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00"
})

module.exports = connection