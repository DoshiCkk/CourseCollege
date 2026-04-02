import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="article-card glass-panel animate-fade">
      {article.coverImage && (
        <img 
          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${article.coverImage}`}
          alt={article.title} 
          className="article-image"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/1e293b/f8fafc?text=No+Image' }}
        />
      )}
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '8px', background: 'var(--glass-border)', color: 'var(--accent)', fontSize: '0.75rem', marginBottom: '8px' }}>
          {t(`categories.${article.category || 'General'}`)}
        </span>
        <p className="article-excerpt">
          {new DOMParser().parseFromString(article.content, 'text/html').body.textContent?.substring(0, 120) || ''}...
        </p>
        <div className="article-meta">
          <span className="article-author">{t('article.by')} {article.author?.name || 'Unknown'}</span>
          <span className="article-date">{new Date(article.createdAt).toLocaleDateString(i18n.language)}</span>
        </div>
        <Link to={`/article/${article._id}`} className="read-more">{t('home.next')} &rarr;</Link>
      </div>
    </div>
  );
};

export default ArticleCard;
