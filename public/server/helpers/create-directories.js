const fs = require('fs');
const path = require('path');

const createDirectories = () => {
  const received = path.resolve('documents/received');
  const issued = path.resolve('documents/issued');
  const xml = path.resolve('documents/xml');

  const directories = [received, issued, xml];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) { 
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

module.exports = {
  createDirectories,
};