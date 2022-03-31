const pdfreader = require('pdfreader');

const { Product } = require('../models');

const isProduct = (line) => {
  const protos = [
    { x: 5, type: 'string' },
    { x: 8, type: 'string' },
    { x: 21, type: 'int' },
    { x: 25, type: 'float' },
  ];

  const isInRange = (x1, x2, range) => {
    return Math.abs(x1 - x2) <= range;
  };

  const isType = (type1, type2) => {
    let typeParsed = type2;

    if (['int', 'float'].includes(type1)) {
      typeParsed = type2.split(' ')[0];
    }

    if (type1 === 'int') {
      return typeof parseInt(typeParsed) === 'number';
    } else if (type1 === 'float') {
      return typeof parseFloat(typeParsed) === 'number';
    } else {
      return typeof typeParsed === 'string';
    }
  };

  const isMatch = (obj, line) =>
    line.find(
      (item) => isInRange(obj.x, item.x, 2) && isType(obj.type, item.text)
    );

  return protos.reduce(function (acc, cur) {
    return acc ? isMatch(cur, line) : acc;
  }, true);
};

const toProduct = (line) => {
  const proto = {
    code: { x: 5, type: 'string' },
    description: { x: 8, type: 'string' },
    quantity: { x: 21, type: 'int' },
    price: { x: 25, type: 'float' },
  };

  const toNumber = (text) => text.split('.').join('').replace(',', '.');
  return Object.keys(proto).reduce((acc, cur) => {
    const section = line.find((item) => Math.abs(item.x - proto[cur].x) < 2);
    if (proto[cur].type === 'int') {
      acc[cur] = parseInt(toNumber(section.text));
    } else if (proto[cur].type === 'float') {
      acc[cur] = parseFloat(toNumber(section.text));
    } else {
      acc[cur] = section.text;
    }
    return acc;
  }, {});
};

const readPdf = ({ dataValues }, documentType) => {
  const { id, pdf } = dataValues;

  return new Promise((res, rej) => {
    let rows = {};

    new pdfreader.PdfReader().parseFileItems(`${pdf}`, function (err, item) {
      if (!item) {
        const ress = Object.keys(rows) 
          .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) 
          .reduce((acc, cur) => {
            acc.push(rows[cur]);
            return acc;
          }, []);

        const pdf = ress.filter(isProduct);
        const products = pdf.map(toProduct);

        if (documentType === 'issued') {
          products.forEach((product) => (product.DocumentIssuedId = id));
        } else {
          products.forEach((product) => (product.DocumentReceivedId = id));
        }

        Product.bulkCreate(products).then(res => res);

        res(products);

      } else if (item.text) {
        (rows[item.y] = rows[item.y] || []).push(item);
      }
    });
  });
};

module.exports = {
  readPdf,
};