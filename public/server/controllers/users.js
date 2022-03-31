const { User } = require('../models');

const getUsers = async (req, res) => {
  try {
    const { offset = 0, limit = 5 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
      User.count({ where: query }),
      User.findAll({
        where: query,
        offset: Number(offset),
        limit: Number(limit),
      }),
    ]);

    res.status(200).json({ total, users });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        msg: '¡Error al intentar recuperar la información de los usuarios!',
      });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: `¡El usuario con id ${id} no pudo ser encontrado!` });
  }
};

const createUser = async (req, res) => {
  try {
    const { status, ...data } = req.body;
    const user = await User.create(data);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: '¡Error al intentar crear un nuevo usuario!' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ...data } = req.body;
    const user = await User.findByPk(id);
    await user.update(data);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ msg: '¡Los datos del usuario no pudieron ser actualizados!' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    await user.update({ status: false });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: '¡El usuario no pudo ser eliminado!' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
