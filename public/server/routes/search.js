const { Router } = require('express');

const { search } = require('../controllers/search');

const router = Router();

router.get('/:document/:id', search);

module.exports = router;
