const axios = require('axios');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

const { options } = require('../config/scraping');
const { cookieFormat, helperNum } = require('./others');

const deliveryGuide = async (data, user) => {
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
    await page.click('#menu-inicio-actividades > li:nth-child(10) > a');
  
    // ---------------- GUIA DE DESPACHO --------------------
    await page.waitForTimeout(2000);
    const rutPartOne = await page.waitForSelector("#collapseRECEPTOR > div > div:nth-child(1) > div:nth-child(1) > div > div > div.col-xs-8 > input");
    const rutPartTwo = await page.waitForSelector("#collapseRECEPTOR > div > div:nth-child(1) > div:nth-child(1) > div > div > div.col-xs-1 > div > input");
    await rutPartOne.type(data.rut[0]);
    await rutPartTwo.type(data.rut[1]);
  
    await rutPartOne.click();
    await page.waitForTimeout(2000);
  
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
        const addProductButton = await page.waitForSelector(
          "input[name='AGREGA_DETALLE']"
        );
        await addProductButton.click();
      }
  
      count++;
    }
  
  
    // ------------------ PREVISUALIZAR EL PDF -------------------
    const validateButton = await page.waitForSelector(
      "button[name='Button_Update']"
    );
    await validateButton.click();
  
    const botonFirmar = await page.waitForSelector("input[name='btnSign']");
    await botonFirmar.click();
  
    const inputClave = await page.waitForSelector("#myPass");
    const botonClave = await page.waitForSelector("#btnFirma");
  
    await inputClave.type(user.key);
    await botonClave.click();
  
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
  
    await page.waitForTimeout(10000);
    await browser.close();
  
    return { 
      document: doc, 
      products: data.products 
    };
    
  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error('No se pudo crear la guia de despacho.');
  }
};

module.exports = {
  deliveryGuide,
};