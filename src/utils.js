const SQL = require('sequelize');
const path  = require("path");

module.exports.createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new SQL('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: path.join(__dirname, "../store.sqlite"),
    operatorsAliases,
    logging: false,
  });

  const users = db.define('user', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: SQL.STRING,
    token: SQL.STRING,
  });

  const campaign = db.define('campaign', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    name: SQL.STRING,
    description: SQL.STRING,
    target: SQL.INTEGER,
    collected: { type:SQL.INTEGER, defaultValue: 0 },
    isActive: { type:SQL.BOOLEAN, defaultValue: true }
  });

  users.hasMany(campaign);
  campaign.belongsTo(users);

  return { users, campaign, db };
};
