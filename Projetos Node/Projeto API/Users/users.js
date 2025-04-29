const Sequelize = require("sequelize");
const connection = require("../DataBase/database");

const Users = connection.define("users", {
    user: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Users.sync({ force: false });

module.exports = Users;
