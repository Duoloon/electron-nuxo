const { DocumentIssued, User } = require('../models');

const { cancellationCreditNote, readPdf } = require('../helpers');

const createCancellationCreditNote = async (req, res) => {
  const user = await User.findOne({ where: { rut: '165939921' } });

  if (!user) {
    return res.status(400).json({ msg: 'No hay un usuario registrado' });
  }

  try {
    const { type, folio } = req.body;

    const newDocument = await cancellationCreditNote(type, folio, user); 
    const savedDocument = await DocumentIssued.create(newDocument);

    await readPdf(savedDocument, 'issued');
    
    return res.status(200).json(savedDocument);

  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: '¡Ha ocurrido un error al crear la nota de crédito de cancelación!' });
  }
};

module.exports = {
  createCancellationCreditNote,
};