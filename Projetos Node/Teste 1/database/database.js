const { Sequelize } = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'titico123', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
