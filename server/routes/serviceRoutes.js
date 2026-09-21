const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Service.find({});
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/services
// @desc    Create a service
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, tag, desc } = req.body;
    const points = typeof req.body.points === 'string' ? JSON.parse(req.body.points) : req.body.points;
    const item = await Service.create({ title, tag, desc, points });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, tag, desc } = req.body;
    const points = typeof req.body.points === 'string' ? JSON.parse(req.body.points) : req.body.points;
    const item = await Service.findByIdAndUpdate(req.params.id, { title, tag, desc, points }, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const item = await Service.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
