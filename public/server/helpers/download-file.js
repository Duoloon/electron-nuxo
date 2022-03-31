const axios = require('axios');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const downloadFile = async (document, item, cookie) => {
  const fileName = `${uuidv4()}.pdf`;
  const filePath = path.resolve(document, fileName);
  
  item.pdf = filePath;

  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url: item.url,
    method: 'GET',
    timeout: 90000,
    httpsAgent: new https.Agent({ keepAlive: true }),
    responseType: 'stream',
    headers: { Cookie: cookie },
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      resolve(item);
    });
    writer.on('error', (err) => {
      reject(err);
    });
  });
};

const fetchAndLog = async (document, item, cookie) => {
  let success = false;

  do {
    try {
      await downloadFile(document, item, cookie);
      console.log(`${item.id} success`);
      success = true;
    } catch (e) {
      console.log(`${item.id} fail`);
    }
  } while (!success);
}

module.exports = {
  downloadFile,
  fetchAndLog,
};