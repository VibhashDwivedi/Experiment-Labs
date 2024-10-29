const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
});

const User = sequelize.define('User', {
  uid: { type: Sequelize.STRING, primaryKey: true },
  email: Sequelize.STRING,
  password: Sequelize.STRING,
});

const Event = sequelize.define('Event', {
  title: Sequelize.STRING,
  date: Sequelize.DATE,
  description: Sequelize.STRING,
  UserId: Sequelize.STRING,
});

User.hasMany(Event);
Event.belongsTo(User);

module.exports = { sequelize, User, Event };