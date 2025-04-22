const express = require('express');
const router = express.Router();
const { getHistory, deleteHistory } = require('../controllers/historyController');
const auth = require('../middleware/auth');

router.get('/', auth, getHistory);
router.get('/:id', auth,deleteHistory); 
module.exports = router;