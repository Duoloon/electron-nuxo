const { DocumentReceived, Product } = require('../models');

const getDocumentsReceived = async (req, res) => {
  try {
    const { offset = 0, limit = 5 } = req.query;
    const query = { status: true };

    const [total, documents] = await Promise.all([
      DocumentReceived.count({ where: query }),
      DocumentReceived.findAll({
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
        msg: '¡No se pudieron recuperar los datos de los documentos recibidos!',
      });
  }
};

const getReceivedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await DocumentReceived.findByPk(id, { include: Product });
    res.status(200).json(document);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: `¡El documento con id ${id} no pudo ser encontrado!` });
  }
};

const createReceivedDocument = async (req, res) => {
  try {
    const { status, ...data } = req.body;
    const document = await DocumentReceived.create(data);
    res.status(201).json(document);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: '¡Error al intentar crear un nuevo documento recibido!' });
  }
};

const updateReceivedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ...data } = req.body;
    const document = await DocumentReceived.findByPk(id);
    await document.update(data);
    res.status(200).json(document);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        msg: '¡Los datos del documento recibido no pudieron ser actualizados!',
      });
  }
};

const deleteReceivedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await DocumentReceived.findByPk(id);
    await document.update({ status: false });
    res.status(200).json(document);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: '¡El documento recibido no pudo ser eliminado!' });
  }
};

module.exports = {
  getDocumentsReceived,
  getReceivedDocument,
  createReceivedDocument,
  updateReceivedDocument,
  deleteReceivedDocument,
};
