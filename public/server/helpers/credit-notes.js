const axios = require('axios');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

const { options } = require('../config/scraping');
const { cookieFormat, findDocumentType } = require('./others');

const cancellationCreditNote = async(type, folio, user) => {
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
  
    const firstSelect = await page.waitForSelector('#headingTwo > h4 > a');
    await firstSelect.click();
    await page.click('#collapseTwo > div > ul > li:nth-child(2) > a');
  
    // ----------- BUSCANDO DOCUMENTO ------------------------
    await page.waitForSelector('#headingFiltro');
    const searchDocumentSelect = await page.waitForSelector('#headingFiltro > h5 > a');
    await searchDocumentSelect.click();
  
    await page.waitForTimeout(2000);

    const folioInput = await page.waitForSelector('#collapseFiltro > div > form > div:nth-child(3) > div:nth-child(2) > div > input');
    const searchButton = await page.waitForSelector('#collapseFiltro > div > form > div:nth-child(7) > div > input');

    const documenType = findDocumentType(type);
    
    await folioInput.type(folio);
    await page.select('select[name="TPO_DOC"]', documenType);
    await searchButton.click();
  
    // ------------- COMPROBANDO EL DOCUMENTO ----------------------
    await page.waitForTimeout(2000);
    const documentExists = await page.$('#tablaDatos > tbody > tr > td.sorting_1 > a');
  
    if (!documentExists) {
      throw new Error('Los datos introducidos no coinciden con ningun documento emitido');
    }
  
    const code = await page.evaluate(() => {
      const link = document.querySelector('#tablaDatos > tbody > tr > td.sorting_1 > a').getAttribute('href');
      const [, secondLink] = link.split('?');
      const separator = secondLink.indexOf('&');
      const capturedCode = secondLink.substring(separator + 1);
      return capturedCode;
    });
  
    // --------------------- CREAR NOTA DE CREDITO -----------------------------
    await page.goto(`https://www1.sii.cl/cgi-bin/Portal001/mipeDisplayPreView.cgi?EHDR_${code}&TIPO_NOTA=61`);

    const botonFirmar = await page.waitForSelector("input[name='btnSign']");
    await botonFirmar.click();
  
    const inputClave = await page.waitForSelector("#myPass");
    const botonClave = await page.waitForSelector("#btnFirma");
  
    await inputClave.type(user.key);
    await botonClave.click();
  
    //-------------------- BUSCAR NOTA DE CREDITO ---------------------------------
    await page.waitForTimeout(5000);
    await page.goto('https://www.sii.cl/servicios_online/1039-1183.html', { waitUntil: 'networkidle2' });
  
    const selectDocuments = await page.waitForSelector('#headingTwo > h4 > a');
    await selectDocuments.click();
  
    await page.click('#collapseTwo > div > ul > li:nth-child(2) > a');
    await page.waitForSelector('div.dataTables_wrapper');

    await page.waitForTimeout(2000);
  
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
    return doc;
    
  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error('No se pudo generar la nota de credito para cancelacion.');    
  }
};

module.exports = {
  cancellationCreditNote,
};