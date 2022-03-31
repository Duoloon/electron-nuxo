const cookieFormat = (cookie) => {
  const formattedCookie = cookie.map((element) => `${element.name}=${element.value};`);
  const newCookie = formattedCookie.join(' ');
  return newCookie;
};

const findDocumentType = (nonStandardType = '') => {
  const standardType = nonStandardType.toLowerCase().trim();
  let value;

  switch (standardType) {
    case 'factura':
      value = '30';
      break;
    case 'factura no afecta':
      value = '32';
      break;
    case 'factura elec.':
      value = '33';
      break;
    case 'factura no afecta elec.':
      value = '34';
      break;
    case 'boleta':
      value = '35';
      break;
    case 'boleta exenta':
      value = '38';
      break;
    case 'boleta elec.':
      value = '39';
      break;
    case 'liq. factura':
      value = '40';
      break;
    case 'boleta exenta elec.':
      value = '41';
      break;
    case 'liq. factura elec.':
      value = '43';
      break;
    case 'factua compra':
      value = '45';
      break;
    case 'factura compra elec.':
      value = '46';
      break;
    case 'comprobante pago elec.':
      value = '48';
      break;
    case 'guia despacho':
      value = '50';
      break;
    case 'guia despacho elec.':
      value = '52';
      break;
    case 'nota debito':
      value = '55';
      break;
    case 'nota debito elec.':
      value = '56';
      break;
    case 'nota credito':
      value = '60';
      break;
    case 'nota credito elec.':
      value = '61';
      break;
    case 'liq. com. dis.':
      value = '103';
      break;
    case 'orden de compra':
      value = '801';
      break;
    case 'nota de pedido':
      value = '802';
      break;
    case 'contrato':
      value = '803';
      break;
    case 'resolucion':
      value = '804';
      break;
    case 'proceso chilecompra':
      value = '805';
      break;
    case 'ficha chilecompra':
      value = '806';
      break;
    case 'pasaporte':
      value = '813';
      break;
    case 'codigo registro de economia':
      value = '820';
      break;
    case 'geo referencia':
      value = '821';
      break;
    case 'rol avaluo predio':
      value = '822';
      break;
    case 'plan de manejo - conaf':
      value = '823';
      break;
    case 'hoja entrada servicio':
      value = 'HES';
      break;
    default:
      value = null;
  }

  return value;
};

const findDocumentTypeForXML = (nonStandardType = '') => {
  const standardType = nonStandardType.toLowerCase().trim();
  let value;

  switch (standardType) {
    case 'factura electronica':
      value = '33';
      break;
    case 'factura exenta electronica':
      value = '34';
      break;
    case 'liquidacion factura electronica':
      value = '43';
      break;
    case 'factura de compra electronica':
      value = '46';
      break;
    case 'nota de debito electronica':
      value = '56';
      break;
    case 'nota de credito electronica':
      value = '61';
      break;
    case 'guia de despacho electronica':
      value = '52';
      break;
    case 'factura de exportacion electronica':
      value = '110';
      break;
    case 'nota de debito de exportacion electronica':
      value = '111';
      break;
    case 'nota de credito de exportacion electronica':
      value = '112';
      break;
    default:
      value = null;
  }

  return value;
};

const helperNum = (num) => {
  const str = '' + num;
  const pad = '00';
  const ans = pad.substring(0, pad.length - str.length) + str;
  return ans;
};

const helperRut = (rut = '') => {
  const newRut = rut.split('-');
  return newRut;
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

module.exports = {
  cookieFormat,
  findDocumentType,
  findDocumentTypeForXML,
  helperNum,
  helperRut,
  sleep,
};
