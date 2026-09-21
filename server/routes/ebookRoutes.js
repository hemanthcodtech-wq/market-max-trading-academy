const express = require('express');
const router = express.Router();
const Ebook = require('../models/Ebook');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/ebooks
// @desc    Get all ebooks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Ebook.find({});
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/ebooks
// @desc    Create a ebook
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const item = await Ebook.create({
      ...req.body,
      topics: typeof req.body.topics === 'string' ? JSON.parse(req.body.topics) : req.body.topics,
      downloadUrl: req.body.downloadUrl || ''
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/ebooks/:id
// @desc    Update a ebook
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const update = {
      ...req.body,
      topics: typeof req.body.topics === 'string' ? JSON.parse(req.body.topics) : req.body.topics
    };
    const item = await Ebook.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Ebook not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/ebooks/:id
// @desc    Delete a ebook
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const item = await Ebook.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Ebook not found' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Ebook removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
