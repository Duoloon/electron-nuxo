const { DocumentIssued, Product } = require('../models');

const getDocumentsIssued = async (req, res) => {
  try {
    const { offset = 0, limit = 5 } = req.query;
    const query = { status: true };

    const [total, documents] = await Promise.all([
      DocumentIssued.count({ where: query }),
      DocumentIssued.findAll({
        where: query,
        offset: Number(offset),
        limit: Number(limit),
        include: Product,
      }),
    ]);

    res.status(200).json({ total, documents });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        msg: '¡No se pudieron recuperar los datos de los documentos emitidos!',
      });
  }
};

const getIssuedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await DocumentIssued.findByPk(id, { include: Product });
    res.status(200).json(document);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: `¡El documento con id ${id} no pudo ser encontrado!` });
  }
};

const createIssuedDocument = async (req, res) => {
  try {
    const { status, ...data } = req.body;
    const document = await DocumentIssued.create(data);
    res.status(201).json(document);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: '¡Error al intentar crear un nuevo documento emitido!' });
  }
};

const updateIssuedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ...data } = req.body;
    const document = await DocumentIssued.findByPk(id);
    await document.update(data);
    res.status(200).json(document);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        msg: '¡Los datos del documento emitido no pudieron ser actualizados!',
      });
  }
};

const deleteIssuedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await DocumentIssued.findByPk(id);
    await document.update({ status: false });
    res.status(200).json(document);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: '¡El documento emitido no pudo ser eliminado!' });
  }
};

module.exports = {
  getDocumentsIssued,
  getIssuedDocument,
  createIssuedDocument,
  updateIssuedDocument,
  deleteIssuedDocument,
};
