import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorPage = ({ code }) => {
  const { t } = useTranslation();
  
  const title = t(`errors.${code}.title`, { defaultValue: t('errors.500.title') });
  const message = t(`errors.${code}.message`, { defaultValue: t('errors.500.message') });
  
  return (
    <div className="container animate-fade" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '60px', width: '100%', maxWidth: '700px' }}>
        <h1 style={{ 
          fontSize: '8rem', 
          margin: 0, 
          lineHeight: 1, 
          background: 'linear-gradient(135deg, var(--accent), var(--accent-cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {code}
        </h1>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>{title}</h2>
        <p className="text-secondary" style={{ fontSize: '1.15rem', maxWidth: '500px', margin: '0 auto 40px auto' }}>
          {message}
        </p>
        <Link to="/" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
          &larr; {t('errors.back_home')}
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
