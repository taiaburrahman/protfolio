const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');
const upload = require('../controllers/uploadMiddleware');

// Create item with images
router.post('/', upload.array('images', 10), createItem);

// Get all items
router.get('/', getAllItems);

// Get single item
router.get('/:id', getItem);

// Update item (with optional new images)
router.put('/:id', upload.array('images', 10), updateItem);

// Delete item
router.delete('/:id', deleteItem);

module.exports = router;