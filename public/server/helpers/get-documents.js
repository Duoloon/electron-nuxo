const path = require('path');
const puppeteer = require('puppeteer');

const downloadPath = path.resolve('documents/xml');

const { findDocumentTypeForXML } = require('./others');
const { searchFiles } = require('./search-files');
const { getJSON } = require('./get-json');

const { options } = require('../config/scraping');

const getDocumentsIssued = async (numberOfRecords = 0) => {
  const browser = await puppeteer.launch(options);

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(120000);
    await page.goto('https://homer.sii.cl/');
    await page.click('#sinAutenticacion > li > a');

    const rutInput = await page.waitForSelector('#rutcntr');
    const passwordInput = await page.waitForSelector('#clave');
    await rutInput.type('165939921');
    await passwordInput.type('Felipe23');
    await page.waitForTimeout(2000);

    await page.click('#bt_ingresar');
    await page.waitForTimeout(2000);
    await page.goto('https://www.sii.cl/servicios_online/1039-1183.html');

    const selectDocuments = await page.waitForSelector('#headingTwo > h4 > a');
    await selectDocuments.click();
    await page.click('#collapseTwo > div > ul > li:nth-child(2) > a');

    await page.waitForTimeout(100);
    await page.waitForSelector('div.dataTables_wrapper');
    const pageLimit = await page.$eval('div.dataTables_paginate.paging_simple_numbers.text-left', (selector) => {
      const text = selector.innerText;
      const arrText = text.split(' ');
      const limit = Number(arrText[arrText.length - 1]);
      return limit;
    });

    const maxRecords = pageLimit - numberOfRecords;

    let documents = [];
    let cont = 1;
    let isBtnDisabled = false;
    let cookie = await page.cookies();

    const objData = { cont, maxRecords };

    while (!isBtnDisabled && cont <= maxRecords) {
      await page.waitForTimeout(100)
      await page.waitForSelector('#tablaDatos');

      const document = await page.evaluate((data) => {
        const rows = Array.from(document.querySelectorAll('#tablaDatos > tbody > tr'));
        const arrObj = [];
        const { maxRecords } = data;
        let cnt = data.cont;

        rows.every((row) => {
          const link = row.querySelector('td:nth-child(1) > a').getAttribute('href');
          const [, secondLink] = link.split('?');
          const separator = secondLink.indexOf('&');
          const code = secondLink.substring(separator + 1);
          const [, codeNumber] = code.split('=');

          const obj = {
            url: `https://www1.sii.cl/cgi-bin/Portal001/mipeDisplayPDF.cgi?DHDR_${code}`,
            code: codeNumber,
            receiver: row.querySelector('td:nth-child(2)').textContent,
            businessName: row.querySelector('td:nth-child(3)').textContent,
            type: row.querySelector('td:nth-child(4)').textContent,
            folio: row.querySelector('td:nth-child(5)').textContent,
            date: row.querySelector('td:nth-child(6)').textContent,
            amount: row.querySelector('td:nth-child(7)').textContent,
            condition: row.querySelector('td:nth-child(8)').textContent,
          };

          arrObj.push(obj);
          cnt++;

          if (cnt > maxRecords) { return false; }
          return true;
        });

        return { arrObj, cnt };
      }, objData);

      const { arrObj, cnt } = document;

      documents = documents.concat(arrObj);
      cont = cnt;

      const is_disabled = (await page.$('a[title="Pagina siguiente"]')) == null;

      isBtnDisabled = is_disabled;

      if (!is_disabled) {
        await Promise.all([
          page.click('a[title="Pagina siguiente"]'),
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
      }
    }

    await browser.close();

    return { documents, cookie };

  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error('¡Error de scraping: no se pudieron recuperar los documentos emitidos!');
  }
};

const getDocumentsReceived = async (numberOfRecords = 0) => {
  const browser = await puppeteer.launch(options);

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(120000);
    await page.goto('https://homer.sii.cl/');
    await page.click('#sinAutenticacion > li > a');

    const rutInput = await page.waitForSelector('#rutcntr');
    const passwordInput = await page.waitForSelector('#clave');
    await rutInput.type('165939921');
    await passwordInput.type('Felipe23');
    await page.waitForTimeout(2000);

    await page.click('#bt_ingresar');
    await page.waitForTimeout(2000);
    await page.goto('https://www.sii.cl/servicios_online/1039-1183.html');

    const selectDocuments = await page.waitForSelector('#headingTwo > h4 > a');
    await selectDocuments.click();
    await page.click('#collapseTwo > div > ul > li:nth-child(4) > a');

    await page.waitForTimeout(100);
    await page.waitForSelector('div.dataTables_wrapper');
    const pageLimit = await page.$eval('div.dataTables_paginate.paging_simple_numbers.text-left', (selector) => {
      const text = selector.innerText;
      const arrText = text.split(' ');
      const limit = Number(arrText[arrText.length - 1]);
      return limit;
    });

    const maxRecords = pageLimit - numberOfRecords;

    let documents = [];
    let cont = 1;
    let isBtnDisabled = false;
    let cookie = await page.cookies();

    const objData = { cont, maxRecords };

    while (!isBtnDisabled && cont <= maxRecords) {
      await page.waitForTimeout(100);
      await page.waitForSelector('#tablaDatos');

      const document = await page.evaluate((data) => {
        const rows = Array.from(document.querySelectorAll('#tablaDatos > tbody > tr'));
        const arrObj = [];
        const { maxRecords } = data;
        let cnt = data.cont;

        rows.every((row) => {
          const link = row.querySelector('td:nth-child(1) > a').getAttribute('href');
          const [, secondLink] = link.split('?');
          const separator = secondLink.indexOf('&');
          const code = secondLink.substring(0, separator);
          const [, codeNumber] = code.split('=');

          const obj = {
            url: `https://www1.sii.cl/cgi-bin/Portal001/mipeShowPdf.cgi?${code}`,
            code: codeNumber,
            sender: row.querySelector('td:nth-child(2)').textContent,
            businessName: row.querySelector('td:nth-child(3)').textContent,
            type: row.querySelector('td:nth-child(4)').textContent,
            folio: row.querySelector('td:nth-child(5)').textContent,
            date: row.querySelector('td:nth-child(6)').textContent,
            amount: row.querySelector('td:nth-child(7)').textContent,
            condition: row.querySelector('td:nth-child(8)').textContent,
          };

          arrObj.push(obj);
          cnt++;

          if (cnt > maxRecords) { return false; }

          return true;
        });

        return { arrObj, cnt };
      }, objData);

      const { arrObj, cnt } = document;

      documents = documents.concat(arrObj);
      cont = cnt;

      const is_disabled = (await page.$('a[title="Pagina siguiente"]')) == null;

      isBtnDisabled = is_disabled;

      if (!is_disabled) {
        await Promise.all([
          page.click('a[title="Pagina siguiente"]'),
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
      }
    }

    await browser.close();

    return { documents, cookie };

  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error('¡Error de scraping: no se pudieron recuperar los documentos recibidos!');
  }
};

const getDocumentsXML = async (data, user) => {
  const browser = await puppeteer.launch(options);
  const { rut, folio, document } = data;
  const documentType = findDocumentTypeForXML(document);

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(120000);
    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });
    await page.goto('https://homer.sii.cl/');
    await page.click('#sinAutenticacion > li > a');

    const rutInput = await page.waitForSelector('#rutcntr');
    const passwordInput = await page.waitForSelector('#clave');
    await rutInput.type(user.rut);
    await passwordInput.type(user.password);
    await page.waitForTimeout(2000);

    await page.click('#bt_ingresar');
    await page.waitForTimeout(2000);
    await page.goto('https://www.sii.cl/servicios_online/1039-1183.html');

    const selectDocuments = await page.waitForSelector('#headingTwo > h4 > a');
    await selectDocuments.click();
    await page.click('#collapseTwo > div > ul > li:nth-child(2) > a');

    await page.waitForTimeout(10000);

    const url = `https://www1.sii.cl/cgi-bin/Portal001/mipeAdminDocsEmi.cgi?ORDEN=&NUM_PAG=1&RUT_RECP=${rut}&FOLIO=${folio}&RZN_SOC=&FEC_DESDE=&FEC_HASTA=&TPO_DOC=${documentType}&ESTADO=&BTN_SUBMIT=Buscar+Documentos`;

    await page.goto(url);
    await page.waitForTimeout(100);
    await page.click('#my-wrapper > div.web-sii.cuerpo > div > p > input:nth-child(2)');

    await page.waitForTimeout(1000);

    const fileName = await searchFiles();
    const result = await getJSON(fileName);

    await browser.close();

    return result;

  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error('Error en el scraping para buscar el documento XML');  
  }
};

module.exports = {
  getDocumentsIssued,
  getDocumentsReceived,
  getDocumentsXML,
};