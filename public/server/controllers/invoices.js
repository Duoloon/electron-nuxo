const { DocumentIssued, Product, User } = require('../models');

const { invoiceElectronic, invoiceNotAffect } = require('../helpers');

const createInvoiceElectronic = async (req, res) => {
  const user = await User.findOne({ order: [['id', 'DESC']] });

  if (!user) {
    return res.status(400).json({ msg: 'No hay un usuario registrado' });
  }

  try {
    const data = req.body;
    const { receiver, document, products } = await invoiceElectronic(data, user);
    const savedDocument = await DocumentIssued.create(document);

    products.forEach(product => product.DocumentIssuedId = savedDocument.id);
    await Product.bulkCreate(products);

    res.status(200).json({ document: savedDocument, receiver });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: '¡Ha ocurrido un error al crear la factura electronica!' });
  }  
};

const createInvoiceNotAffect = async (req, res) => {
  // const user = await User.findOne({ where: { rut: '165939921' } });
  const user = await User.findOne({ order: [['id', 'DESC']] });

  if (!user) {
    return res.status(400).json({ msg: 'No hay un usuario registrado' });
  }

  try {
    const data = req.body;
    const { receiver, document, products } = await invoiceNotAffect(data, user);
    const savedDocument = await DocumentIssued.create(document);

    products.forEach(product => product.DocumentIssuedId = savedDocument.id);
    await Product.bulkCreate(products);

    res.status(200).json({ document: savedDocument, receiver });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: '¡Ha ocurrido un error al crear la factura no afecta!' });
  } 
};

module.exports = {
  createInvoiceElectronic,
  createInvoiceNotAffect,
};