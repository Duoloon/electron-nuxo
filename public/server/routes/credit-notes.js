const { Router } = require('express');

const { createCancellationCreditNote } = require('../controllers/credit-notes');

const router = Router();

router.post('/', createCancellationCreditNote);

module.exports = router;
