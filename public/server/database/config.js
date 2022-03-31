const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/nuxo.sqlite',
  logging: false,
});

const dbConnection = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('No se puede conectar a la base de datos:', error);
  }
};

module.exports = {
  sequelize,
  dbConnection,
};
