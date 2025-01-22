const express = require('express');
const router = express.Router();
const { createBundle, getAllBundles } = require('../controllers/bundlesController');

router.post('/', createBundle);

router.get('/', getAllBundles);

module.exports = router;
