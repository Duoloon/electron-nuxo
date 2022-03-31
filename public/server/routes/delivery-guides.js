const { Router } = require('express');

const { createDeliveryGuide } = require('../controllers/delivery-guides');

const router = Router();

router.post('/', createDeliveryGuide);

module.exports = router;
