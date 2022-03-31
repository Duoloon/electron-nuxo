const fs = require('fs');
const path = require('path');

const directoryPath = path.resolve('documents/xml');

const searchFiles = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log(err);
        reject('Unable to scan directory');
      } else {
        resolve(files[0]);
      }
    });
  });
};

module.exports = {
  searchFiles,
};
