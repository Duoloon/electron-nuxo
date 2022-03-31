const { Router } = require('express');

const { 
  createInvoiceElectronic,
  createInvoiceNotAffect,
} = require('../controllers/invoices');

const router = Router();

router.post('/electronic', createInvoiceElectronic);
router.post('/notaffect', createInvoiceNotAffect);

module.exports = router;
