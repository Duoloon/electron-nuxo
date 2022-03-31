const { Router } = require('express');

const {
  getDocumentsReceived,
  getReceivedDocument,
  createReceivedDocument,
  updateReceivedDocument,
  deleteReceivedDocument,
} = require('../controllers/documents-received');

const router = Router();

router.get('/', getDocumentsReceived);
router.get('/:id', getReceivedDocument);
router.post('/', createReceivedDocument);
router.put('/:id', updateReceivedDocument);
router.delete('/:id', deleteReceivedDocument);

module.exports = router;
