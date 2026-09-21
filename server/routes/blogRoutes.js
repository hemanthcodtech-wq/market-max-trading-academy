const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// @route   GET /api/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Blog.find({});
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get one blog for the public details page
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(req.params.id);
    const item = isObjectId
      ? await Blog.findById(req.params.id)
      : await Blog.findOne({ slug: req.params.id });
    if (!item) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid blog id' });
  }
});

// @route   POST /api/blogs
// @desc    Create a blog
// @access  Private/Admin
router.post('/', protect, admin, upload.single('blogImage'), async (req, res) => {
  try {
    const slug = req.body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const item = await Blog.create({
      ...req.body,
      slug,
      tags: typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags,
      image: req.file?.location || req.file?.path || req.body.image || ''
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('blogImage'), async (req, res) => {
  try {
    const update = {
      ...req.body,
      tags: typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags
    };
    if (req.body.title) {
      update.slug = req.body.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (req.file) update.image = req.file.location || req.file.path;
    const item = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const item = await Blog.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Blog removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
