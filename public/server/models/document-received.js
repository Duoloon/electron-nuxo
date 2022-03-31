const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Product = require('./product');

const DocumentReceived = sequelize.define('DocumentReceived', {
  url: {
    type: DataTypes.STRING,
  },
  code: {
    type: DataTypes.STRING,
  },
  sender: {
    type: DataTypes.STRING,
  },
  businessName: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  folio: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.STRING,
  },
  condition: {
    type: DataTypes.STRING,
  },
  pdf: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: false,
});

DocumentReceived.hasMany(Product);
Product.belongsTo(DocumentReceived);

module.exports = DocumentReceived;