const { Router } = require('express');

const {
  getDocumentsIssued,
  getIssuedDocument,
  createIssuedDocument,
  updateIssuedDocument,
  deleteIssuedDocument,
} = require('../controllers/documents-issued');

const router = Router();

router.get('/', getDocumentsIssued);
router.get('/:id', getIssuedDocument);
router.post('/', createIssuedDocument);
router.put('/:id', updateIssuedDocument);
router.delete('/:id', deleteIssuedDocument);

module.exports = router;
