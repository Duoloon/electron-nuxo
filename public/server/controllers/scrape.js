const { response, request } = require('express');

const { 
  DocumentIssued, 
  DocumentReceived 
} = require('../models');

const {
  readPdf,
  scrapingIssuedDocuments,
  scrapingReceivedDocuments,
} = require('../helpers');

const allowedDocuments = ['issued', 'received'];

const scrapeIssuedDocuments = async (req, res) => {
  try {
    const newDocuments = await scrapingIssuedDocuments();

    if (newDocuments.length == 0) {
      return res
        .status(200)
        .json({ msg: 'No hay documentos nuevos que registrar' });
    }

    const savedDocuments = await DocumentIssued.bulkCreate(newDocuments);

    const promises = savedDocuments.map((document) => readPdf(document, 'issued'));

    await Promise.all(promises);

    res.status(200).json({
      msg: `${savedDocuments.length} documentos emitidos han sido registrados`,
    });

  } catch (error) {
    res.status(400).json({ msg: `${error.message}` });
  }
};

const scrapeReceivedDocuments = async (req, res) => {
  try {
    const newDocuments = await scrapingReceivedDocuments();

    if (newDocuments.length == 0) {
      return res
        .status(200)
        .json({ msg: 'No hay documentos nuevos que registrar' });
    }

    const savedDocuments = await DocumentReceived.bulkCreate(newDocuments);
    
    const promises = savedDocuments.map((document) => readPdf(document, 'received'));

    await Promise.all(promises);

    res.status(200).json({
      msg: `${savedDocuments.length} documentos recibidos han sido registrados`,
    });
    
  } catch (error) {
    res.status(400).json({ msg: `${error.message}` });
  }
};

const scrape = (req = request, res = response) => {
  const { document } = req.params;

  if (!allowedDocuments.includes(document)) {
    return res
      .status(400)
      .json({ msg: `Los documentos permitidos son: ${allowedDocuments}` });
  }

  switch (document) {
    case 'issued':
      scrapeIssuedDocuments(req, res);
      break;
    case 'received':
      scrapeReceivedDocuments(req, res);
      break;
    default:
      res.status(500).json({ msg: '¡Error en el servidor!' });
  }
};

module.exports = {
  scrape,
};
