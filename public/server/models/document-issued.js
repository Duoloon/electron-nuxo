const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Product = require('./product');

const DocumentIssued = sequelize.define('DocumentIssued', {
  url: {
    type: DataTypes.STRING,
  },
  code: {
    type: DataTypes.STRING,
  },
  receiver: {
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

DocumentIssued.hasMany(Product);
Product.belongsTo(DocumentIssued);

module.exports = DocumentIssued;