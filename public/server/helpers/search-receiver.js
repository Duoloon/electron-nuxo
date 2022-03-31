const puppeteer = require('puppeteer');

const { helperRut } = require('./others');

const { options } = require('../config/scraping');

const searchReceiver = async (rut, user) => {
  const browser = await puppeteer.launch(options);
  const receiverRut = helperRut(rut);

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
    await rutPartOne.type(receiverRut[0]);
    await rutPartTwo.type(receiverRut[1]);
  
    await rutPartOne.click();
    await page.waitForTimeout(5000);

     // --------------- DATOS DEL RECEPTOR -----------------------
    const receiver = await page.evaluate(() => {
      const businessName = document.querySelector('#collapseRECEPTOR > div > div:nth-child(1) > div:nth-child(2) > div > input').value;
      const addressSelect = Array.from(document.querySelector('#collapseRECEPTOR > div > div:nth-child(2) > div.col-sm-6 > div > select'));
      const address = addressSelect.map(option => option.textContent);
      const city = document.querySelector('#collapseRECEPTOR > div > div:nth-child(2) > div:nth-child(2) > div > input').value;
      const commune = document.querySelector('#collapseRECEPTOR > div > div:nth-child(2) > div:nth-child(3) > div > input').value;
      const giroSelect = Array.from(document.querySelector('#collapseRECEPTOR > div > div:nth-child(3) > div > div > select'));
      const giro = giroSelect.map(option => option.textContent);

      return {
        businessName,
        address,
        city,
        commune,
        giro,
      };
    });

    receiver.address = receiver.address.toString();
    receiver.giro = receiver.giro.toString();
    receiver.rut = rut;

    await page.waitForTimeout(100);
    await browser.close();
  
    return receiver;
    
  } catch (error) {
    console.log(error);
    await browser.close();
    throw new Error('No se pudo encontrar al receptor solicitado.');
  }
};

module.exports = {
  searchReceiver,
};