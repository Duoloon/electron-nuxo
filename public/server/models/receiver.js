const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Receiver = sequelize.define('Receiver', {
  rut: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  businessName: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  commune: {
    type: DataTypes.STRING,
  },
  giro: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
});

module.exports = Receiver;
