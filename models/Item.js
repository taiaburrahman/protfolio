const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  imageFiles: [{  // Stores only filenames
    type: String,
    required: [true, 'At least one image is required']
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      // Convert filenames to full URLs
      ret.images = ret.imageFiles.map(filename => 
        `${process.env.BASE_URL}/uploads/${filename}`
      );
      delete ret.imageFiles; // Remove from response
      return ret;
    }
  }
});

module.exports = mongoose.model('Item', itemSchema);