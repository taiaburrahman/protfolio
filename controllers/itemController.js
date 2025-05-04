const Item = require('../models/Item');
const fs = require('fs');
const path = require('path');

// @route   POST /api/items
// @desc    Create new item with images
exports.createItem = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    const newItem = new Item({
      title,
      description,
      imageFiles: req.files.map(file => file.filename)
    });

    await newItem.save();
    res.status(201).json(newItem);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/items
// @desc    Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/items/:id
// @desc    Get single item
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/items/:id
// @desc    Update item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const updates = {
      title: req.body.title || item.title,
      description: req.body.description || item.description
    };

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Delete old images
      item.imageFiles.forEach(filename => {
        fs.unlink(path.join('uploads', filename), err => {
          if (err) console.error('Error deleting image:', err);
        });
      });
      updates.imageFiles = req.files.map(file => file.filename);
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.status(200).json(updatedItem);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   DELETE /api/items/:id
// @desc    Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Delete associated images
    item.imageFiles.forEach(filename => {
      fs.unlink(path.join('uploads', filename), err => {
        if (err) console.error('Error deleting image:', err);
      });
    });

    await item.remove();
    res.status(200).json({ message: 'Item deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};