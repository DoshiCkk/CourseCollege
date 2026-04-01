import mongoose from 'mongoose';

const articleSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String },
  views: { type: Number, default: 0 },
  category: { type: String, default: 'General', enum: ['General', 'Technology', 'Science', 'Politics', 'Sports', 'Culture', 'Business'] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
