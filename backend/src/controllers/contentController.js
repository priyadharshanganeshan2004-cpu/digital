const PortfolioItem = require('../models/PortfolioItem');
const BlogPost = require('../models/BlogPost');
const asyncHandler = require('../middleware/asyncHandler');

const getPortfolioItems = asyncHandler(async (req, res) => {
  const items = await PortfolioItem.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

const getPortfolioItemsPublic = asyncHandler(async (req, res) => {
  const items = await PortfolioItem.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

const getPortfolioItemById = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }
  res.json({ success: true, data: item });
});

const createPortfolioItem = asyncHandler(async (req, res) => {
  const { title, category, description, results, color, isFeatured, sortOrder, isActive } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const slug = (req.body.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const item = await PortfolioItem.create({
    title,
    slug,
    category: category || 'Website',
    description: description || '',
    results: results || [],
    color: color || 'from-blue-500 to-indigo-600',
    isFeatured: Boolean(isFeatured),
    isActive: isActive !== false,
    sortOrder: sortOrder || 0,
  });

  res.status(201).json({ success: true, data: item });
});

const updatePortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  Object.keys(req.body || {}).forEach((key) => {
    if (req.body[key] !== undefined) {
      item[key] = req.body[key];
    }
  });

  if (req.body.title && !req.body.slug) {
    item.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const updated = await item.save();
  res.json({ success: true, data: updated, message: 'Portfolio item updated successfully' });
});

const deletePortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  await item.deleteOne();
  res.json({ success: true, message: 'Portfolio item deleted successfully' });
});

const getBlogPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: posts.length, data: posts });
});

const getBlogPostsPublic = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: posts.length, data: posts });
});

const getBlogPostById = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  res.json({ success: true, data: post });
});

const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const post = await BlogPost.findOne({ slug, isPublished: true });
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  res.json({ success: true, data: post });
});

const createBlogPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, author, readTime, color, imageUrl, isPublished, isFeatured, sortOrder } = req.body;

  if (!title || !excerpt) {
    res.status(400);
    throw new Error('Title and excerpt are required');
  }

  const slug = (req.body.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const post = await BlogPost.create({
    title,
    slug,
    excerpt,
    content: content || '',
    category: category || 'Marketing',
    author: author || 'NexusDigital Team',
    readTime: readTime || 5,
    color: color || 'from-blue-500 to-indigo-600',
    imageUrl: imageUrl || '',
    isPublished: isPublished !== false,
    isFeatured: Boolean(isFeatured),
    sortOrder: sortOrder || 0,
  });

  res.status(201).json({ success: true, data: post });
});

const updateBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  Object.keys(req.body || {}).forEach((key) => {
    if (req.body[key] !== undefined) {
      post[key] = req.body[key];
    }
  });

  if (req.body.title && !req.body.slug) {
    post.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const updated = await post.save();
  res.json({ success: true, data: updated, message: 'Blog post updated successfully' });
});

const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  await post.deleteOne();
  res.json({ success: true, message: 'Blog post deleted successfully' });
});

module.exports = {
  getPortfolioItems,
  getPortfolioItemsPublic,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getBlogPosts,
  getBlogPostsPublic,
  getBlogPostById,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
