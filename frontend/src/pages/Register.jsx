import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error(t('errors.400.message'));
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.user, res.data.token);
      toast.success(t('nav.welcome'));
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || t('errors.400.message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="glass-panel animate-fade">
        <h2 className="text-center mb-6">{t('auth.register_title')}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('auth.name')}</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={loading}
              placeholder={t('auth.name')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={loading}
              placeholder={t('auth.email')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={loading}
              placeholder={t('auth.password')}
            />
          </div>
          
          <button type="submit" className="btn-primary mt-4" disabled={loading}>
            {loading ? <div className="loader" style={{width: '20px', height: '20px', borderWidth: '2px'}}/> : t('auth.btn_register')}
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm text-secondary">
          {t('auth.have_account')} <Link to="/login" className="text-accent">{t('nav.login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
