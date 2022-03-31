const fs = require('fs');
const xml2js = require('xml2js');

const getJSON = async (fileName) => {
  try {
    const filePath = `documents/xml/${fileName}`;
    const xml = fs.readFileSync(filePath);
    const result = await xml2js.parseStringPromise(xml, { mergeAttrs: true });
  
    const [obj1] = result.SetDTE.DTE;
    const [obj2] = obj1.Documento;
    const [obj3] = obj2.Encabezado;
  
    const { Detalle, TED } = obj2;
    const { Emisor, Receptor } = obj3;
  
    const newObject = {};
    let index = 0;
  
    if (Detalle.length > 1) {
      const arrayObjects = [TED[0], Emisor[0], Receptor[0]];
      const newProperties = ['ted', 'emisor', 'receptor'];
      const auxiliaryArray = [];
  
      for (const object of Detalle) {
        const auxiliaryObject = {};
  
        for (const propertie in object) {
          auxiliaryObject[propertie] = object[propertie][0];
        }
  
        auxiliaryArray.push(auxiliaryObject);
      }
  
      newObject.detalle = auxiliaryArray;
  
      for (const object of arrayObjects) {
        const auxiliaryObject = {};
  
        for (const propertie in object) {
          auxiliaryObject[propertie] = object[propertie][0];
        }
  
        newObject[newProperties[index]] = auxiliaryObject;
        index++;
      }
  
    } else {
      const arrayObjects = [Detalle[0], TED[0], Emisor[0], Receptor[0]];
      const newProperties = ['detalle', 'ted', 'emisor', 'receptor'];
  
      for (const object of arrayObjects) {
        const auxiliaryObject = {};
  
        for (const propertie in object) {
          auxiliaryObject[propertie] = object[propertie][0];
        }
  
        newObject[newProperties[index]] = auxiliaryObject;
        index++;
      }
    }
    
    newObject.ted = JSON.stringify(newObject.ted);

    fs.unlinkSync(filePath);

    return newObject;
    
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }  
};

module.exports = {
  getJSON,
};
