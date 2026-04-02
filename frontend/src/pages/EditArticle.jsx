import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../services/api';

const EditArticle = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setFormData({ title: res.data.title, content: res.data.content, category: res.data.category || 'General' });
      } catch (err) {
        toast.error(t('errors.404.message'));
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, t]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || formData.content === '<p><br></p>') {
      return toast.error(t('errors.400.message'));
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      if (file) data.append('coverImage', file);

      const res = await api.put(`/articles/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(t('article.save'));
      navigate(`/article/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || t('errors.500.message'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="container animate-fade" style={{ maxWidth: '800px', paddingTop: '40px' }}>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="editor-title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          disabled={saving}
          placeholder={t('article.title_placeholder')}
          autoFocus
        />

        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          disabled={saving}
          style={{ padding: '12px 16px', borderRadius: '12px', border: '2px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', marginBottom: '24px', width: '100%', outline: 'none', fontSize: '1rem' }}
        >
          {['General','Technology','Science','Politics','Sports','Culture','Business'].map(c => (
            <option key={c} value={c} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{t(`categories.${c}`)}</option>
          ))}
        </select>

        <div className="file-dropzone">
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={saving}
          />
          <div className="flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {file ? file.name : t('article.dropzone')}
            </span>
          </div>
        </div>

        <div className="quill-container">
          <ReactQuill 
            theme="snow"
            value={formData.content}
            onChange={handleEditorChange}
            modules={modules}
            placeholder={t('article.content_placeholder')}
            readOnly={saving}
          />
        </div>

        <div className="flex justify-between items-center" style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
          <span className="text-secondary text-sm"></span>
          <button type="submit" className="btn-primary" disabled={saving} style={{ minWidth: '160px' }}>
            {saving ? <div className="loader" style={{width: '20px', height: '20px', borderWidth: '2px'}}/> : t('article.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
