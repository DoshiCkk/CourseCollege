import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const CreateArticle = () => {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return toast.error('Title and Content cannot be empty');
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (file) {
        data.append('coverImage', file);
      }

      const res = await api.post('/articles', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Article published successfully!');
      navigate(`/article/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="glass-panel animate-fade">
        <h2 className="mb-6 text-center">Write a New Article</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              disabled={loading}
              placeholder="E.g., The Future of AI"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Cover Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              style={{ backgroundColor: 'transparent', padding: 0, border: 'none' }}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              disabled={loading}
              placeholder="Write your article content here..."
              rows="10"
              style={{ resize: 'vertical', width: '100%', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          
          <button type="submit" className="btn-primary mt-4" disabled={loading}>
            {loading ? <div className="loader" style={{width: '20px', height: '20px', borderWidth: '2px'}}/> : 'Publish Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
