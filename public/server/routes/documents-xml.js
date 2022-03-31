const { Router } = require('express');

const { search } = require('../controllers/documents-xml');

const router = Router();

router.get('/', search);

module.exports = router;
