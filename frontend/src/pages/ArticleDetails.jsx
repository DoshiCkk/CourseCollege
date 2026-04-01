import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        setError('Article not found or server is down.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/articles/${id}`);
        toast.success('Article deleted successfully');
        navigate('/');
      } catch (err) {
        toast.error('Failed to delete article');
      }
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  
  if (error || !article) return (
    <div className="glass-panel text-center animate-fade" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="text-error mb-4">{error}</h2>
      <Link to="/" className="btn-primary" style={{ width: 'auto', display: 'inline-block' }}>Back to Home</Link>
    </div>
  );

  const isAuthor = user && article.author && user._id === article.author._id;

  return (
    <div className="container animate-fade" style={{ maxWidth: '800px' }}>
      <Link to="/" className="text-secondary mb-4 display-inline-block">&larr; Back to Articles</Link>
      
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {article.coverImage && (
          <img 
            src={`http://localhost:5000/uploads/${article.coverImage}`} 
            alt={article.title} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        
        <div style={{ padding: '40px' }}>
          <h1 className="mb-4">{article.title}</h1>
          
          <div className="flex justify-between items-center mb-6 text-secondary" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
            <span>By <strong>{article.author?.name || 'Unknown'}</strong></span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>

          {isAuthor && (
            <div className="flex gap-4 mb-6">
              <Link to={`/edit-article/${article._id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem' }}>Edit Article</Link>
              <button onClick={handleDelete} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem', color: 'var(--error)', borderColor: 'var(--error)' }}>Delete</button>
            </div>
          )}
          
          <div 
            className="article-body ql-editor" 
            style={{ padding: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }} 
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
