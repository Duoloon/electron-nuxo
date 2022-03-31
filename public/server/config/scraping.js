const puppeteer = require('puppeteer');
const path = require('path');

/* const isPkg = typeof process.pkg !== 'undefined';

let chromiumExecutablePath = isPkg
  ? puppeteer
      .executablePath()
      .replace(
        /^.*?\/node_modules\/puppeteer\/\.local-chromium/,
        path.join(path.dirname(process.execPath), 'chromium')
      )
  : puppeteer.executablePath();

//check win32
if (process.platform == 'win32') {
  chromiumExecutablePath = isPkg
    ? puppeteer
        .executablePath()
        .replace(
          /^.*?\\node_modules\\puppeteer\\\.local-chromium/,
          path.join(path.dirname(process.execPath), 'chromium')
        )
    : puppeteer.executablePath();
} */

let chromiumExecutablePath = puppeteer
.executablePath()
.replace("app.asar", "app.asar.unpacked")

const options = {
  headless: false,
  executablePath: chromiumExecutablePath,
  args: ['--disable-notifications'],
  defaultViewport: { width: 1366, height: 768 },
  timeout: 120000,
};

module.exports = {
  options,
};