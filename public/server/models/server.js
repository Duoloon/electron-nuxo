const express = require('express');
const cors = require('cors');

const { createDirectories } = require('../helpers/create-directories');
const { dbConnection } = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = 9000 || process.env.PORT ;
    this.paths = {
      creditNotes: '/api/notes/credit',
      deliveryGuides: '/api/guides',
      documentsIssued: '/api/documents/issued',
      documentsReceived: '/api/documents/received',
      documentsXML: '/api/documents/xml/',
      invoices: '/api/invoices',
      receivers: '/api/receivers',
      search: '/api/search',
      scrape: '/api/scrape',
      users: '/api/users',
      server: '/api/server'
    };

    this.connectDB();
    this.middlewares();
    this.routes();
    this.directories();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.creditNotes, require('../routes/credit-notes'));
    this.app.use(this.paths.documentsIssued, require('../routes/documents-issued'));
    this.app.use(this.paths.documentsReceived, require('../routes/documents-received'));
    this.app.use(this.paths.documentsXML, require('../routes/documents-xml'));
    this.app.use(this.paths.deliveryGuides, require('../routes/delivery-guides'));
    this.app.use(this.paths.invoices, require('../routes/invoices'));
    this.app.use(this.paths.receivers, require('../routes/receivers'));
    this.app.use(this.paths.search, require('../routes/search'));
    this.app.use(this.paths.scrape, require('../routes/scrape'));
    this.app.use(this.paths.users, require('../routes/users'));
    this.app.use(this.paths.server, require('../routes/server'));
  }

  directories() {
    createDirectories();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }
}

module.exports = Server;
