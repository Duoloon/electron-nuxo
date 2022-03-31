const creditNotes = require('./credit-notes');
const deliveryGuide = require('./delivery-guide');
const downloadFile = require('./download-file');
const getDocuments = require('./get-documents');
const invoices = require('./invoices');
const others = require('./others');
const readPdf = require('./read-pdf');
const searchFiles = require('./search-files');
const searchReceiver = require('./search-receiver');
const scraping = require('./scraping');

module.exports = {
  ...creditNotes,
  ...deliveryGuide,
  ...downloadFile,
  ...getDocuments,
  ...invoices,
  ...others,
  ...readPdf,
  ...searchFiles,
  ...searchReceiver,
  ...scraping,
};
