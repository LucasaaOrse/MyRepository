// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/db.sqlite' // caminho corrigido
    },
    useNullAsDefault: true, // necessário para SQLite
    migrations: {
      directory: './src/database/migrations'
    }
  }

};
