const mongoose = require('mongoose');

const slugify = (value) => value
  .toString()
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)+/g, '');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true, index: true },
  excerpt: { type: String },
  content: { type: String },
  category: { type: String },
  readTime: { type: String },
  author: { type: String },
  image: { type: String },
  pdfUrl: { type: String },
  tags: [{ type: String }]
}, { timestamps: true });

blogSchema.pre('save', function() {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title);
  }
});

module.exports = mongoose.model('Blog', blogSchema);
