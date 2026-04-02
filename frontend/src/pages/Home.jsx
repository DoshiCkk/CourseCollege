import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ArticleCard from '../components/ArticleCard';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        setArticles(res.data);
        setFiltered(res.data);
      } catch (err) {
        setArticles([]);
        setFiltered([]);
        setError(t('errors.500.message'));
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [t]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      articles.filter(a => {
        const matchQ = q ? a.title.toLowerCase().includes(q) || (a.author?.name || '').toLowerCase().includes(q) : true;
        const matchC = category !== 'All' ? a.category === category : true;
        return matchQ && matchC;
      })
    );
    setPage(1); // Reset page on filter change
  }, [search, category, articles]);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="animate-fade">
      <div className="home-header">
        <h1 className="home-title">{t('home.title')}</h1>
        
        <div className="home-filters">
          <select 
            className="filter-select"
            value={category} 
            onChange={e => setCategory(e.target.value)} 
          >
            {['All','General','Technology','Science','Politics','Sports','Culture','Business'].map(c => (
              <option key={c} value={c}>{t(`categories.${c}`)}</option>
            ))}
          </select>

          <input
            className="search-input"
            type="text"
            placeholder={t('home.search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="glass-panel mb-4 text-secondary">{error}</div>}
      
      {filtered.length === 0 ? (
        <p className="text-secondary text-center glass-panel">
          {search || category !== 'All' ? t('home.no_results') : t('home.no_articles')}
        </p>
      ) : (
        <>
          <div className="articles-grid">
            {paginated.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(p => Math.max(1, p-1))} 
                disabled={page === 1} 
                className="btn-secondary" 
                style={{ padding: '8px 18px' }}
              >
                &larr; {t('home.prev')}
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button 
                  key={i+1} 
                  onClick={() => setPage(i+1)} 
                  className={page === i+1 ? 'btn-primary' : 'btn-secondary'} 
                  style={{ padding: '8px 14px', minWidth: '40px' }}
                >
                  {i+1}
                </button>
              ))}
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p+1))} 
                disabled={page === totalPages} 
                className="btn-secondary" 
                style={{ padding: '8px 18px' }}
              >
                {t('home.next')} &rarr;
              </button>
            </div>
          )}

          <p className="text-secondary text-center" style={{ marginTop: '24px', fontSize: '0.85rem' }}>
            {t('home.showing', { count: paginated.length, total: filtered.length })}
          </p>
        </>
      )}
    </div>
  );
};

export default Home;
