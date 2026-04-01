import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const EditArticle = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setFormData({ title: res.data.title, content: res.data.content });
      } catch (err) {
        toast.error('Failed to load article details');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return toast.error('Title and Content cannot be empty');
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (file) data.append('coverImage', file);

      const res = await api.put(`/articles/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Article updated successfully!');
      navigate(`/article/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="glass-panel animate-fade">
        <h2 className="mb-6 text-center">Edit Article</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} disabled={saving} />
          </div>
          <div className="form-group">
            <label className="form-label">Update Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} disabled={saving} style={{ backgroundColor: 'transparent', padding: 0, border: 'none' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} disabled={saving} rows="10" style={{ resize: 'vertical', width: '100%', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button type="submit" className="btn-primary mt-4" disabled={saving}>
            {saving ? <div className="loader" style={{width: '20px', height: '20px', borderWidth: '2px'}}/> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;
