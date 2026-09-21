const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tag: { type: String },
  desc: { type: String },
  points: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
