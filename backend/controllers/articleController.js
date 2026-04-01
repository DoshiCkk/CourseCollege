import Article from '../models/Article.js';

/**
 * @desc    Get all articles
 * @route   GET /api/articles
 * @access  Public
 */
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).populate('author', 'name email').sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single article by ID and increment views
 * @route   GET /api/articles/:id
 * @access  Public
 */
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name email');
    
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new article
 * @route   POST /api/articles
 * @access  Private
 */
export const createArticle = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let coverImage = '';
    
    if (req.file) {
      coverImage = req.file.filename;
    }

    const article = new Article({
      title,
      content,
      category: category || 'General',
      coverImage,
      author: req.user._id,
    });

    const createdArticle = await article.save();
    res.status(201).json(createdArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update an existing article
 * @route   PUT /api/articles/:id
 * @access  Private
 */
export const updateArticle = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const article = await Article.findById(req.params.id);

    if (article) {
      if (article.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to edit this article' });
      }

      article.title = title || article.title;
      article.content = content || article.content;
      article.category = category || article.category;
      
      if (req.file) {
        article.coverImage = req.file.filename;
      }

      const updatedArticle = await article.save();
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete an article
 * @route   DELETE /api/articles/:id
 * @access  Private
 */
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (article) {
      if (article.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to delete this article' });
      }

      await article.deleteOne();
      res.json({ message: 'Article removed' });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Toggle Like on an article
 * @route   PUT /api/articles/:id/like
 * @access  Private
 */
export const likeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    
    const uid = req.user._id.toString();
    const alreadyLiked = article.likes.map(l => l.toString()).includes(uid);
    
    if (alreadyLiked) {
      article.likes = article.likes.filter(l => l.toString() !== uid);
    } else {
      article.likes.push(req.user._id);
    }
    
    await article.save();
    res.json({ likes: article.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
