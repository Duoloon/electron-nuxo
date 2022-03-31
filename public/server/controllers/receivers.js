const { Receiver, User } = require('../models');

const { searchReceiver } = require('../helpers');

const getReceivers = async (req, res) => {
  try {
    const { offset = 0, limit = 5 } = req.query;
    const query = { status: true };

    const [total, receivers] = await Promise.all([
      Receiver.count({ where: query }),
      Receiver.findAll({
        where: query,
        offset: Number(offset),
        limit: Number(limit),
      }),
    ]);

    res.status(200).json({ total, receivers });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        msg: '¡Error al intentar recuperar la información de los receptores!',
      });
  }
};

const getReceiver = async (req, res) => {
  try {
    const { rut } = req.body;
    const receiverExists = await Receiver.findOne({ where: { rut } });

    if (!receiverExists) {
      const user = await User.findOne({ where: { rut: '165939921' } });

      if (!user) {
        return res.status(400).json({ msg: 'No hay un usuario registrado' });
      }

      const data = await searchReceiver(rut, user);
      const receiver = await Receiver.create(data);
      return res.status(200).json(receiver);
    }

    res.status(200).json(receiverExists);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: `¡El receptor con rut ${rut} no pudo ser encontrado!` });
  }
};

module.exports = {
  getReceivers,
  getReceiver,
};
