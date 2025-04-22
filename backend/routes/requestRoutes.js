const express = require('express');
const router = express.Router();
const { executeRequest } = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.post('/', auth, executeRequest);

module.exports = router;