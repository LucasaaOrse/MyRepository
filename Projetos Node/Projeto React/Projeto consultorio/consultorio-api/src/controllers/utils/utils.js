const db = require('../../database/connection');

async function findUserById(id) {
  const user = await db('users').where({ id }).first();
  return user;
}

async function findUserByEmail(email) {
  const user = await db('users').where({ email }).first();
  return user;
}

module.exports = { findUserByEmail, findUserById }
