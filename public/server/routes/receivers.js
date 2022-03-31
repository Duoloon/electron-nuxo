const { Router } = require('express');

const {
  getReceivers,
  getReceiver,
} = require('../controllers/receivers');

const router = Router();

router.get('/', getReceivers);
router.get('/search', getReceiver);

module.exports = router;
