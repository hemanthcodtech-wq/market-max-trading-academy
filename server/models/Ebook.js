const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  pages: { type: String },
  rating: { type: String },
  category: { type: String },
  language: { type: String },
  description: { type: String },
  topics: [{ type: String }],
  downloadUrl: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Ebook', ebookSchema);
