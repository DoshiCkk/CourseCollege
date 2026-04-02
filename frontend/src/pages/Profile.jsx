import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ count: 0, views: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/articles');
        const myArticles = res.data.filter(a => a.author?._id === user?._id);
        const totalViews = myArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);
        setStats({ count: myArticles.length, views: totalViews });
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setStatsLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error(t('errors.400.message'));
    }
    if (formData.password && formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
      });
      updateUser(res.data.user, res.data.token);
      toast.success(t('profile.save'));
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ paddingTop: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        
        {/* Profile Settings */}
        <div className="glass-panel">
          <h2 className="mb-6">{t('profile.settings')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('profile.name')}</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                placeholder={t('profile.name')}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('profile.email')}</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange}
                placeholder={t('profile.email')}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('profile.new_password')}</label>
              <input 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            {formData.password && (
              <div className="form-group animate-fade">
                <label className="form-label">{t('profile.confirm_password')}</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            <button className="btn-primary mt-4" style={{ width: '100%' }} disabled={loading}>
              {loading ? <div className="loader" style={{width: '20px', height: '20px', borderWidth: '2px'}}/> : t('profile.save')}
            </button>
          </form>
        </div>

        {/* Dashboard / Stats */}
        <div className="glass-panel" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent)' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 style={{ margin: 0 }}>{t('profile.performance')}</h2>
            <Link to="/my-articles" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{t('nav.my_articles')} &rarr;</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', background: 'rgba(139, 92, 246, 0.05)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                {statsLoading ? '...' : stats.count}
              </div>
              <div className="text-secondary text-sm">{t('profile.articles')}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', background: 'rgba(6, 182, 212, 0.05)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {statsLoading ? '...' : stats.views}
              </div>
              <div className="text-secondary text-sm">{t('profile.views')}</div>
            </div>
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
            <div className="mb-2">
              <span className="text-secondary">{t('profile.user_id')}:</span> 
              <code style={{ fontSize: '0.8rem', marginLeft: '8px', color: 'var(--text-primary)' }}>{user?._id}</code>
            </div>
            <div>
              <span className="text-secondary">{t('profile.member_since')}:</span>
              <span style={{ marginLeft: '8px' }}>{new Date(user?.createdAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
