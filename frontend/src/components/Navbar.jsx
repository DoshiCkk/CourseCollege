import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">NewsPortal <span className="logo-dot">.</span></Link>
        <div className="nav-links">
          
          <div className="lang-switcher">
            <button onClick={() => changeLanguage('en')} className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}>EN</button>
            <button onClick={() => changeLanguage('ru')} className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}>RU</button>
            <button onClick={() => changeLanguage('kk')} className={`lang-btn ${i18n.language === 'kk' ? 'active' : ''}`}>KK</button>
          </div>

          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          {user ? (
            <>
              <span className="nav-user">{t('nav.welcome')}, <span style={{color: 'var(--text-primary)', fontWeight: 600}}>{user.name}</span></span>
              <Link to="/profile" className="nav-link">{t('nav.profile')}</Link>
              <Link to="/my-articles" className="nav-link">{t('nav.my_articles')}</Link>
              <Link to="/create-article" className="nav-link">{t('nav.new_article')}</Link>
              <button onClick={handleLogout} className="btn-secondary nav-btn">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary nav-btn">{t('nav.register')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
