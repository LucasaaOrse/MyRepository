const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define("categories", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Category.sync({ force: false }); // Garante que a tabela será criada caso não exista

module.exports = Category;
