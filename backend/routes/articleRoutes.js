import express from 'express';
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle, likeArticle } from '../controllers/articleController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getArticles)
  .post(protect, upload.single('coverImage'), createArticle);

router.route('/:id')
  .get(getArticleById)
  .put(protect, upload.single('coverImage'), updateArticle)
  .delete(protect, deleteArticle);

router.route('/:id/like').put(protect, likeArticle);

export default router;
