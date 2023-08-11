const Sequelize = require('sequelize');

// Database name, username, password
const sequelize = new Sequelize('baseprueba', 'root', 'Fernanda1441', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
