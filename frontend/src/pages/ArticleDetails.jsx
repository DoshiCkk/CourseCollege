import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import api from '../services/api';

const ArticleDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
        setLikes(res.data.likes?.length || 0);
        setLiked(res.data.likes?.includes(user?._id));
      } catch (err) {
        setError(t('errors.404.message'));
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, t, user]);

  const handleDelete = async () => {
    if (window.confirm(t('article.confirm_delete'))) {
      try {
        await api.delete(`/articles/${id}`);
        toast.success(t('article.delete'));
        navigate('/');
      } catch (err) {
        toast.error(t('errors.403.message'));
      }
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  
  if (error || !article) return (
    <div className="glass-panel text-center animate-fade" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="text-error mb-4">{error}</h2>
      <Link to="/" className="btn-primary" style={{ width: 'auto', display: 'inline-block' }}>{t('errors.back_home')}</Link>
    </div>
  );

  const isAuthor = user && article.author && user._id === article.author._id;

  const handleLike = async () => {
    if (!user) return toast.error(t('errors.401.message'));
    try {
      const res = await api.put(`/articles/${id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {
      toast.error(t('errors.500.message'));
    }
  };

  return (
    <div className="container animate-fade" style={{ maxWidth: '800px' }}>
      <Link to="/" className="text-secondary mb-4 display-inline-block">&larr; {t('article.back')}</Link>
      
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {article.coverImage && (
          <img 
            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${article.coverImage}`} 
            alt={article.title} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        
        <div style={{ padding: '40px' }}>
          <h1 className="mb-4">{article.title}</h1>
          
          <div className="flex justify-between items-center mb-6 text-secondary" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
            <span>{t('article.by')} <strong>{article.author?.name || 'Unknown'}</strong></span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span>👁 {article.views || 0} {t('article.views')}</span>
              <span>{new Date(article.createdAt).toLocaleDateString(i18n.language)}</span>
              <button onClick={handleLike} style={{ background: 'none', border: '1px solid var(--glass-border)', padding: '6px 14px', borderRadius: '8px', color: liked ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {liked ? '♥' : '♡'} {likes}
              </button>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-4 mb-6">
              <Link to={`/edit-article/${article._id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem' }}>{t('article.edit')}</Link>
              <button onClick={handleDelete} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem', color: 'var(--error)', borderColor: 'var(--error)' }}>{t('article.delete')}</button>
            </div>
          )}
          
          <div 
            className="article-body ql-editor" 
            style={{ padding: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }} 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
