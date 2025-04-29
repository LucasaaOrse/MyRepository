const Sequelize = require("sequelize");
const path = require("path");

const connection = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "database.sqlite"), // Define onde o banco será armazenado
    logging: false, // Para evitar logs desnecessários no console
});

module.exports = connection;
