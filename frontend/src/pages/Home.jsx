import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import api from '../services/api';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        setArticles(res.data);
      } catch (err) {
        setArticles([]);
        setError('No connection to database. Please refresh or check server.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="mb-6">Latest Articles</h1>
      {error && <div className="glass-panel mb-4 text-secondary">{error}</div>}
      {articles.length === 0 ? (
        <p className="text-secondary text-center glass-panel">No articles found. Be the first to publish!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
