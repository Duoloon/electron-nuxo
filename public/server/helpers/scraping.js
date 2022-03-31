const { 
  DocumentIssued,
  DocumentReceived 
} = require('../models');

const { 
  getDocumentsIssued, 
  getDocumentsReceived 
} = require('./get-documents');

const { cookieFormat } = require('./others');
const { chunks } = require('./chunks');
const { downloadFile } = require('./download-file');

const scrapingIssuedDocuments = async () => {
  try {
    const savedDocuments = await DocumentIssued.findAll();
    const { documents, cookie } = await getDocumentsIssued(savedDocuments.length);

    const formattedCookie = cookieFormat(cookie);
    const requestOptions = { cookie: formattedCookie, document: 'documents/issued' };

    const downloadedDocuments = await chunks(documents, requestOptions, downloadFile, 50); 
    return downloadedDocuments;
    
  } catch (error) {
    console.log(error);
    throw new Error('Error en el scraping de documentos emitidos');
  }
};

const scrapingReceivedDocuments = async() => {
  try {
    const savedDocuments = await DocumentReceived.findAll();
    const { documents, cookie } = await getDocumentsReceived(savedDocuments.length);

    const formattedCookie = cookieFormat(cookie);
    const requestOptions = { cookie: formattedCookie, document: 'documents/received' };

    const downloadedDocuments = await chunks(documents, requestOptions, downloadFile, 50);
    return downloadedDocuments;

  } catch (error) {
    console.log(error);
    throw new Error('Error en el scraping de documentos recibidos');
  }
};

module.exports = {
  scrapingIssuedDocuments,
  scrapingReceivedDocuments
};