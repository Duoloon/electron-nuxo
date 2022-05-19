'use strict';

(function () {
  require('dotenv').config();
  const { Server } = require('./models');
  
  const serverinit = new Server();
  const server = serverinit.listen();

  module.exports = server;
})();
