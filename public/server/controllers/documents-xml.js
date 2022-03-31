const { User } = require('../models');

const { getDocumentsXML } = require('../helpers');

const search = async (req, res) => {
  const user = await User.findOne({ where: { rut: '165939921' } });

  if (!user) {
    return res.status(400).json({ msg: 'No hay un usuario registrado' });
  }

  try {
    const data = req.body;
    const XMLData = await getDocumentsXML(data, user);
    res.status(200).json(XMLData);
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'No se encontró información acorde al documento solicitado' });
  }
};

module.exports = {
  search,
};