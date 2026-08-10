const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: '', trim: true },
    content: { type: String, default: '' },
    category: { type: String, default: 'Marketing', trim: true },
    author: { type: String, default: 'Scalax Labs Team', trim: true },
    readTime: { type: Number, default: 5 },
    color: { type: String, default: 'from-blue-500 to-indigo-600' },
    imageUrl: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);

