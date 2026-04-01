import { Link } from 'react-router-dom';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  return (
    <div className="article-card glass-panel animate-fade">
      {article.coverImage && (
        <img 
          src={`http://localhost:5000/uploads/${article.coverImage}`} 
          alt={article.title} 
          className="article-image"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/1e293b/f8fafc?text=No+Image' }}
        />
      )}
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">{article.content.substring(0, 100)}...</p>
        <div className="article-meta">
          <span className="article-author">By {article.author?.name || 'Unknown'}</span>
          <span className="article-date">{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <Link to={`/article/${article._id}`} className="read-more">Read More &rarr;</Link>
      </div>
    </div>
  );
};

export default ArticleCard;
