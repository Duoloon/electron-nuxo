const { Op } = require('sequelize');
const path = require('path');
const fs = require("fs");
const { DocumentIssued, DocumentReceived } = require('../models');

const search = async (req, res) => {
  const { document, id } = req.params;
  let model;

  switch (document) {
    case 'issued':
      model = await DocumentIssued.findOne({
        where: { [Op.or]: [{ id: id }, { folio: id }] },
      });

      if (!model) {
        return res.status(400).json({
          msg: `No existe un documento emitido con el id/folio ${id}`,
        });
      }
      break;

    case 'received':
      model = await DocumentReceived.findOne({
        where: { [Op.or]: [{ id: id }, { folio: id }] },
      });

      if (!model) {
        return res.status(400).json({
          msg: `No existe un documento recibido con el id/folio ${id}`,
        });
      }
      break;

    default:
      return res.status(400).json({ msg: 'El tipo de documento no es válido' });
  }

  if (model && model.pdf) {
    if (fs.existsSync(model.pdf)) {
      return res.sendFile(model.pdf);
    }
  }

  const pathDocument = path.resolve('assets/no-document.jpg');
  res.sendFile(pathDocument);
};

module.exports = {
  search,
};
