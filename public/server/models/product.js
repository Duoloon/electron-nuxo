const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Product = sequelize.define('Product', {
  code: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
},{
  timestamps: false,
});

module.exports = Product;