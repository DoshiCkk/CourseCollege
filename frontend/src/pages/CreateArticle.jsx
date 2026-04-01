import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../services/api';

const CreateArticle = () => {
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEditorChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || formData.content === '<p><br></p>') {
      return toast.error('Title and Content cannot be empty');
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
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
    <div className="container animate-fade" style={{ maxWidth: '800px', paddingTop: '40px' }}>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="editor-title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          disabled={loading}
          placeholder="New Article Title..."
          autoFocus
        />

        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          disabled={loading}
          style={{ padding: '12px 16px', borderRadius: '12px', border: '2px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', marginBottom: '24px', width: '100%', outline: 'none', fontSize: '1rem' }}
        >
          {['General','Technology','Science','Politics','Sports','Culture','Business'].map(c => (
            <option key={c} value={c} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{c}</option>
          ))}
        </select>

        <div className="file-dropzone">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          <div className="flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {file ? file.name : "Click or drag to attach a striking cover image"}
            </span>
          </div>
        </div>

        <div className="quill-container">
          <ReactQuill 
            theme="snow"
            value={formData.content}
            onChange={handleEditorChange}
            modules={modules}
            placeholder="Start typing your amazing story here..."
            readOnly={loading}
          />
        </div>

        <div className="flex justify-between items-center" style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
          <span className="text-secondary text-sm">Draft saved automatically</span>
          <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '160px' }}>
            {loading ? <div className="loader" style={{width: '20px', height: '20px', borderWidth: '2px'}}/> : 'Publish Article &rarr;'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
