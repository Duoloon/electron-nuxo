const { DocumentIssued, Product, User } = require('../models');

const { deliveryGuide } = require('../helpers');

const createDeliveryGuide = async (req, res) => {
  const user = await User.findOne({ where: { rut: '165939921' } });

  if (!user) {
    return res.status(400).json({ msg: 'No hay un usuario registrado' });
  }

  try {
    const data = req.body;
    const { document, products } = await deliveryGuide(data, user);
    const savedDocument = await DocumentIssued.create(document);

    products.forEach(element => element.DocumentIssuedId = savedDocument.id);
    await Product.bulkCreate(products);

    res.status(200).json(savedDocument);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: '¡Ha ocurrido un error al crear la guia de despacho!' });
  }  
};

module.exports = {
  createDeliveryGuide,
};