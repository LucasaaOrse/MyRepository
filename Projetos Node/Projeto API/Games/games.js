const Sequelize = require("sequelize");
const connection = require("../DataBase/database");

const Games = connection.define("games", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: Sequelize.FLOAT,  // SQLite pode não suportar DECIMAL
        allowNull: false
    }
});

Games.sync({ force: false });

module.exports = Games;
