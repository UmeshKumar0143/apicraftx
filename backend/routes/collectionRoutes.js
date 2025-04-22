const express = require('express');
const router = express.Router();
const { createCollection, getCollections, deleteCollection } = require('../controllers/collectionController');
const auth = require('../middleware/auth');

router.post('/', auth, createCollection);
router.get('/', auth, getCollections);
router.delete('/:id', auth, deleteCollection);

module.exports = router;