import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="glass-panel animate-fade">
        <h2 className="text-center mb-6">Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="btn-primary mt-4" disabled={loading}>
            {loading ? <div className="loader" style={{width: '20px', height: '20px', borderWidth: '2px'}}/> : 'Log In'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm text-secondary">
          Don't have an account? <Link to="/register" className="text-accent">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
