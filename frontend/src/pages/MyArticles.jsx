import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const MyArticles = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyArticles = async () => {
    try {
      const res = await api.get('/articles');
      setArticles(res.data.filter(a => a.author?._id === user?._id));
    } catch {
      toast.error(t('errors.500.message'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyArticles(); }, [t]);

  const handleDelete = async (id) => {
    if (!window.confirm(t('article.confirm_delete'))) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success(t('article.delete'));
      setArticles(prev => prev.filter(a => a._id !== id));
    } catch {
      toast.error(t('errors.403.message'));
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="animate-fade container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>{t('nav.my_articles')}</h1>
        <Link to="/create-article" className="btn-primary" style={{ width: 'auto' }}>+ {t('nav.new_article')}</Link>
      </div>

      <div className="glass-panel mb-6" style={{ padding: '20px', marginBottom: '24px' }}>
        <p style={{ margin: 0 }}>
          {t('nav.welcome')}, <strong>{user?.name}</strong> — {user?.email} &nbsp;|&nbsp; {t('profile.articles')}: <strong>{articles.length}</strong>
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-secondary text-center glass-panel">{t('home.no_articles')} <Link to="/create-article" className="text-accent">{t('nav.new_article')}</Link></p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {articles.map(article => (
            <div key={article._id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px' }}>{article.title}</h3>
                <span className="text-secondary text-sm">{new Date(article.createdAt).toLocaleDateString(i18n.language)}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/article/${article._id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>{t('home.next')} &rarr;</Link>
                <Link to={`/edit-article/${article._id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>{t('article.edit')}</Link>
                <button onClick={() => handleDelete(article._id)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.875rem', color: 'var(--error)', borderColor: 'var(--error)' }}>{t('article.delete')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArticles;
