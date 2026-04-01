import Article from '../models/Article.js';

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).populate('author', 'name email').sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email');
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    let coverImage = '';
    
    if (req.file) {
      coverImage = req.file.filename;
    }

    const article = new Article({
      title,
      content,
      coverImage,
      author: req.user._id,
    });

    const createdArticle = await article.save();
    res.status(201).json(createdArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await Article.findById(req.params.id);

    if (article) {
      if (article.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to edit this article' });
      }

      article.title = title || article.title;
      article.content = content || article.content;
      
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
