const Sequelize = require("sequelize")
const connection = require("../database/database")

const Task = connection.define('Task', {
    designacao: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    client: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    typeTask: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'tasks', // Garante que o Sequelize usa a tabela correta
    timestamps: true, // Para incluir createdAt e updatedAt
});

module.exports = Task;