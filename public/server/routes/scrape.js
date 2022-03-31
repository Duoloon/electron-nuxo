const { Router } = require('express');

const { scrape } = require('../controllers/scrape');

const router = Router();

router.get('/documents/:document', scrape);

module.exports = router;
