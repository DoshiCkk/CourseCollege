import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.user, res.data.token);
      toast.success('Registration successful! Welcome.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="glass-panel animate-fade">
        <h2 className="text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={loading}
              placeholder="John Doe"
            />
          </div>
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
            <label className="form-label">Password (Min 6 chars)</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={loading}
              placeholder="Create a password"
            />
          </div>
          
          <button type="submit" className="btn-primary mt-4" disabled={loading}>
            {loading ? <div className="loader" style={{width: '20px', height: '20px', borderWidth: '2px'}}/> : 'Register'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm text-secondary">
          Already have an account? <Link to="/login" className="text-accent">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
