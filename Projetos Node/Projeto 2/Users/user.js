const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define("users", { // Nome da tabela em minúsculas
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true // Impede que o Sequelize pluralize o nome da tabela
});

// Sincroniza a tabela no banco de dados
User.sync({ force: false })
    .then(() => console.log("Tabela de usuários sincronizada"))
    .catch((err) => console.log("Erro ao sincronizar tabela de usuários:", err));

module.exports = User;
