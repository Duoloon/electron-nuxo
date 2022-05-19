const axios = require('axios');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

const { options } = require('../config/scraping');

const { 
  cookieFormat,
  findDocumentType, 
  helperNum 
} = require('./others');

const invoiceElectronic = async (data, user) => {
  const browser = await puppeteer.launch(options);

  try {
    // ---------- INGRESANDO A LA PÁGINA -------------------
    const page = await browser.newPage();
    page.setDefaultTimeout(120000);
    // await page.goto('https://homer.sii.cl/');
    // await page.click('#sinAutenticacion > li > a');
    
    // ----------- SISTEMA DE FACTURACIÓN GRATUITO -------------
    await page.goto('https://www.sii.cl/servicios_online/1039-1183.html', { waitUntil: 'networkidle2' });
    const firstSelect = await page.waitForSelector('#headingOne > h4 > a');
    await firstSelect.click();
    await page.click('#menu-inicio-actividades > li:nth-child(2) > a');

    // --------------- INICIO DE SESION --------------------
    // await page.waitForTimeout(2000);
    const rutInput = await page.waitForSelector('#rutcntr');
    const passwordInput = await page.waitForSelector('#clave');
    await rutInput.type(user.rut);
    await passwordInput.type(user.password);
    await page.waitForTimeout(2000);
    await page.click('#bt_ingresar');

    // ------------- COMPROBAR RUT -------------------------
    await page.waitForTimeout(2000);
    const otherRut = await page.waitForSelector('#my-wrapper > div.web-sii.cuerpo > div > p:nth-child(4) > a:nth-child(1)');

    if (otherRut) {
      await otherRut.click();
      await page.waitForTimeout(5000);
      await page.select('#fPrmEmpPOP > div > div.col-sm-8.col-sm-offset-2 > div > div > select', data.otherRut);
      await page.click('#fPrmEmpPOP > div > div.col-sm-12.text-center > button');
    }

    // ---------------- FACTURA ELECTRONICA --------------------
    await page.waitForTimeout(2000);
    const rutPartOne = await page.waitForSelector('#EFXP_RUT_RECEP');
    const rutPartTwo = await page.waitForSelector('#EFXP_DV_RECEP');
    await rutPartOne.type(data.rut[0]);
    await rutPartTwo.type(data.rut[1]);

    await rutPartOne.click();
    await page.waitForTimeout(2000);

    // --------------- DATOS DEL RECEPTOR -----------------------
    const receiver = await page.evaluate(() => {
      const businessName = document.querySelector('#collapseRECEPTOR > div > div:nth-child(1) > div:nth-child(2) > div > input').getAttribute('value');
      const addressSelect = Array.from(document.querySelector('#collapseRECEPTOR > div > div:nth-child(2) > div:nth-child(2) > div > select'));
      const addresses = addressSelect.map(options => options.textContent);
      const city = document.querySelector('#collapseRECEPTOR > div > div:nth-child(3) > div:nth-child(2) > div > input').value;
      const commune = document.querySelector('#collapseRECEPTOR > div > div:nth-child(3) > div:nth-child(1) > div > input').value;
      const purchaseSelect = document.querySelector('#collapseRECEPTOR > div > div:nth-child(2) > div:nth-child(1) > div > select');
      const typeOfPurchase = purchaseSelect.options[purchaseSelect.selectedIndex].textContent;
      const giroSelect = Array.from(document.querySelector('#collapseRECEPTOR > div > div:nth-child(4) > div > div > select'));
      const giros = giroSelect.map(options => options.textContent);

      return {
        businessName,
        addresses,
        city,
        commune,
        typeOfPurchase,
        giros,
      };
    });

    receiver.rut = `${data.rut[0]}-${data.rut[1]}`;

    let count = 1;

    while (count <= data.products.length) {
      const numRow = helperNum(count);

      const productName = await page.waitForSelector(
        "input[name='EFXP_NMB_" + numRow + "']"
      );
      const productQuantity = await page.waitForSelector(
        "input[name='EFXP_QTY_" + numRow + "']"
      );
      const productUnit = await page.waitForSelector(
        "input[name='EFXP_UNMD_" + numRow + "']"
      );
      const productPrice = await page.waitForSelector(
        "input[name='EFXP_PRC_" + numRow + "']"
      );

      await productName.type(data.products[count - 1].description);
      await productQuantity.type(data.products[count - 1].quantity);
      await productUnit.type(data.products[count - 1].unit);
      await productPrice.type(data.products[count - 1].price);

      if (count != 10) {
        const addProductButton = await page.waitForSelector("input[name='AGREGA_DETALLE']");
        await addProductButton.click();
      }

      count++;
    }

    // ---------------- SELECCIÓN DEL MÉTODO DE PAGO ----------------------
    await page.select("select[name='EFXP_FMA_PAGO']", data.paymentMethod);

    // ----------------------- REFERENCIAS --------------------------------
    if (data.references) {
      const checkbox = await page.$('#tblRefPago > tbody > tr.item-row > th:nth-child(1) > input[type=checkbox]');
      await checkbox.click();
      const folioInput = await page.waitForSelector('#rowRef_1 > td:nth-child(3) > input');
      const razonInput = await page.waitForSelector('#rowRef_1 > td:nth-child(5) > input');

      const documentType = findDocumentType(data.references.document);
      await page.select('#rowRef_1 > td:nth-child(1) > select', documentType);

      await folioInput.type(data.references.folio);
      await razonInput.type(data.references.razon);
    }

    // ------------------ PREVISUALIZAR EL PDF -------------------
    const validateButton = await page.waitForSelector("button[name='Button_Update']");
    await validateButton.click();
  
    // ------------------ FIRMAR EL DOCUMENTO --------------------
    const botonFirmar = await page.waitForSelector("input[name='btnSign']");
    await botonFirmar.click();
  
    const inputClave = await page.waitForSelector("#myPass");
    const botonClave = await page.waitForSelector("#btnFirma");
  
    await inputClave.type(user.key);
    await botonClave.click();

    // ------------------ BUSCAR DATOS DEL DOCUMENTO ---------------------
    await page.waitForTimeout(5000);
    await page.goto('https://www.sii.cl/servicios_online/1039-1183.html', { waitUntil: 'networkidle2' });

    const selectDocuments = await page.waitForSelector('#headingTwo > h4 > a');
    await selectDocuments.click();

    await page.click('#collapseTwo > div > ul > li:nth-child(2) > a');
    await page.waitForSelector('div.dataTables_wrapper');

    const doc = await page.evaluate(() => {
      const link = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td.sorting_1 > a').getAttribute('href');
      const receiver = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(2)').textContent;
      const businessName = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td.small').textContent;
      const type = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(4)').textContent;
      const number = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(5)').textContent;
      const date = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(6)').textContent;
      const amount = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(7)').textContent;
      const condition = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(8)').textContent;

      const [, secondLink] = link.split('?');
      const separator = secondLink.indexOf('&');
      const code = secondLink.substring(separator + 1);

      const [, codeNumber] = code.split('=');

      return {
        url: `https://www1.sii.cl/cgi-bin/Portal001/mipeDisplayPDF.cgi?DHDR_${code}`,
        code: codeNumber,
        receiver,
        businessName,
        type,
        folio: number,
        date,
        amount,
        condition,
      };
    });

    // ------------------ DESCARGAR DOCUMENTO ---------------------
    const cookie = await page.cookies();
    const finalCookie = cookieFormat(cookie);

    const fileName = uuidv4();
    const filePath = path.resolve('documents/issued', `${fileName}.pdf`);
    
    const response = await axios({
      method: 'get',
      url: doc.url,
      responseType: 'stream',
      headers: { Cookie: finalCookie },
    });
    
    response.data.pipe(fs.createWriteStream(filePath));
    doc.pdf = filePath;
  
    await page.waitForTimeout(5000);

    // --------------- FIN DEL SCRAPING Y RETORNO DE LOS RESULTADOS ----------------
    await browser.close();
    
    return {
      receiver,
      document: doc,
      products: data.products,
    };

  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error('No se pudo generar la factura electronica.');
  }
};

const invoiceNotAffect = async (data, user) => {
  const browser = await puppeteer.launch(options);

  try {
    // ---------- INGRESANDO A LA PÁGINA -------------------
    const page = await browser.newPage();
    page.setDefaultTimeout(120000);
    await page.goto('https://homer.sii.cl/');
    await page.click('#sinAutenticacion > li > a');
  
    // -------------- INICIO DE SESION --------------------
    const rutInput = await page.waitForSelector('#rutcntr');
    const passwordInput = await page.waitForSelector('#clave');
    await rutInput.type(user.rut);
    await passwordInput.type(user.password);
    await page.waitForTimeout(2000);
    await page.click('#bt_ingresar');
  
    // ----------- SISTEMA DE FACTURACIÓN GRATUITO -------------
    await page.waitForTimeout(2000);
    await page.goto('https://www.sii.cl/servicios_online/1039-1183.html', { waitUntil: 'networkidle2' });
  
    const firstSelect = await page.waitForSelector('#headingOne > h4 > a');
    await firstSelect.click();
    await page.click('#menu-inicio-actividades > li:nth-child(4) > a');
  
    // ---------------- FACTURA NO AFECTA  --------------------
    await page.waitForTimeout(2000);
    const rutPartOne = await page.waitForSelector('#EFXP_RUT_RECEP');
    const rutPartTwo = await page.waitForSelector('#EFXP_DV_RECEP');
    await rutPartOne.type(data.rut[0]);
    await rutPartTwo.type(data.rut[1]);
  
    await rutPartOne.click();
    await page.waitForTimeout(2000);

    // --------------- DATOS DEL RECEPTOR -----------------------
    const receiver = await page.evaluate(() => {
      const businessName = document.querySelector('#collapseRECEPTOR > div > div:nth-child(1) > div:nth-child(2) > div > input').getAttribute('value');
      const addressSelect = Array.from(document.querySelector('#collapseRECEPTOR > div > div:nth-child(2) > div:nth-child(2) > div > select'));
      const addresses = addressSelect.map(options => options.textContent);
      const city = document.querySelector('#collapseRECEPTOR > div > div:nth-child(3) > div:nth-child(2) > div > input').value;
      const commune = document.querySelector('#collapseRECEPTOR > div > div:nth-child(3) > div:nth-child(1) > div > input').value;
      const purchaseSelect = document.querySelector('#collapseRECEPTOR > div > div:nth-child(2) > div:nth-child(1) > div > select');
      const typeOfPurchase = purchaseSelect.options[purchaseSelect.selectedIndex].textContent;
      const giroSelect = Array.from(document.querySelector('#collapseRECEPTOR > div > div:nth-child(4) > div > div > select'));
      const giros = giroSelect.map(options => options.textContent);

      return {
        businessName,
        addresses,
        city,
        commune,
        typeOfPurchase,
        giros,
      };
    });

    receiver.rut = `${data.rut[0]}-${data.rut[1]}`;

    let count = 1;
  
    while (count <= data.products.length) {
      const numRow = helperNum(count);
  
      const productName = await page.waitForSelector(
        "input[name='EFXP_NMB_" + numRow + "']"
      );
      const productQuantity = await page.waitForSelector(
        "input[name='EFXP_QTY_" + numRow + "']"
      );
      const productUnit = await page.waitForSelector(
        "input[name='EFXP_UNMD_" + numRow + "']"
      );
      const productPrice = await page.waitForSelector(
        "input[name='EFXP_PRC_" + numRow + "']"
      );
  
      await productName.type(data.products[count - 1].description);
      await productQuantity.type(data.products[count - 1].quantity);
      await productUnit.type(data.products[count - 1].unit);
      await productPrice.type(data.products[count - 1].price);
  
      if (count != 10) {
        const addProductButton = await page.waitForSelector("input[name='AGREGA_DETALLE']");
        await addProductButton.click();
      }
  
      count++;
    }
  
    // ---------------- SELECCIÓN DEL MÉTODO DE PAGO ----------------------
    await page.select("select[name='EFXP_FMA_PAGO']", data.paymentMethod);

    // ----------------------- REFERENCIAS --------------------------------
    if (data.references) {
      const checkbox = await page.$('#tblRefPago > tbody > tr.item-row > th:nth-child(1) > input[type=checkbox]');
      await checkbox.click();
      const folioInput = await page.waitForSelector('#rowRef_1 > td:nth-child(3) > input');
      const razonInput = await page.waitForSelector('#rowRef_1 > td:nth-child(5) > input');

      const documentType = findDocumentType(data.references.document);
      await page.select('#rowRef_1 > td:nth-child(1) > select', documentType);

      await folioInput.type(data.references.folio);
      await razonInput.type(data.references.razon);
    }
  
    // ------------------ PREVISUALIZAR EL PDF -------------------
    const validateButton = await page.waitForSelector("button[name='Button_Update']");
    await validateButton.click();

    // ------------------ FIRMAR EL DOCUMENTO --------------------
    const botonFirmar = await page.waitForSelector("input[name='btnSign']");
    await botonFirmar.click();
  
    const inputClave = await page.waitForSelector("#myPass");
    const botonClave = await page.waitForSelector("#btnFirma");
  
    await inputClave.type(user.key);
    await botonClave.click();

    // ------------------ BUSCAR DATOS DEL DOCUMENTO ---------------------
    await page.waitForTimeout(5000);
    await page.goto('https://www.sii.cl/servicios_online/1039-1183.html', { waitUntil: 'networkidle2' });

    const selectDocuments = await page.waitForSelector('#headingTwo > h4 > a');
    await selectDocuments.click();

    await page.click('#collapseTwo > div > ul > li:nth-child(2) > a');
    await page.waitForSelector('div.dataTables_wrapper');

    const doc = await page.evaluate(() => {
      const link = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td.sorting_1 > a').getAttribute('href');
      const receiver = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(2)').textContent;
      const businessName = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td.small').textContent;
      const type = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(4)').textContent;
      const number = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(5)').textContent;
      const date = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(6)').textContent;
      const amount = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(7)').textContent;
      const condition = document.querySelector('#tablaDatos > tbody > tr:nth-child(1) > td:nth-child(8)').textContent;

      const [, secondLink] = link.split('?');
      const separator = secondLink.indexOf('&');
      const code = secondLink.substring(separator + 1);

      const [, codeNumber] = code.split('=');

      return {
        url: `https://www1.sii.cl/cgi-bin/Portal001/mipeDisplayPDF.cgi?DHDR_${code}`,
        code: codeNumber,
        receiver,
        businessName,
        type,
        folio: number,
        date,
        amount,
        condition,
      };
    });

    // ------------------ DESCARGAR DOCUMENTO ---------------------
    const cookie = await page.cookies();
    const finalCookie = cookieFormat(cookie);

    const fileName = uuidv4();
    const filePath = path.resolve('documents/issued', `${fileName}.pdf`);
    
    const response = await axios({
      method: 'get',
      url: doc.url,
      responseType: 'stream',
      headers: { Cookie: finalCookie },
    });
    
    response.data.pipe(fs.createWriteStream(filePath));
    doc.pdf = filePath;
  
    await page.waitForTimeout(5000);

    // --------------- FIN DEL SCRAPING Y RETORNO DE LOS RESULTADOS ----------------
    await browser.close();
    
    return {
      receiver,
      document: doc,
      products: data.products,
    };
    
  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error('No se pudo generar la factura no afecta.');    
  }
};

module.exports = {
  invoiceElectronic,
  invoiceNotAffect,
};