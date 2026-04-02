import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          NewsPortal <span className="logo-dot">.</span>
        </Link>
        
        {/* Mobile Toggle */}
        <button className={`mobile-toggle ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

        <div className={`nav-main ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={closeMenu}>{t('home.title')}</Link>
            {user && (
              <>
                <Link to="/my-articles" className="nav-link" onClick={closeMenu}>{t('nav.my_articles')}</Link>
                <Link to="/create-article" className="nav-link" onClick={closeMenu}>{t('nav.new_article')}</Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            <div className="lang-switcher">
              {['en', 'ru', 'kk'].map((lng) => (
                <button 
                  key={lng} 
                  onClick={() => changeLanguage(lng)} 
                  className={`lang-btn ${i18n.language === lng ? 'active' : ''}`}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>

            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            {user ? (
              <div className="user-section">
                <Link to="/profile" className="user-profile-link" onClick={closeMenu}>
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span className="user-name-abbr">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn-logout-icon" title={t('nav.logout')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="nav-link" onClick={closeMenu}>{t('nav.login')}</Link>
                <Link to="/register" className="btn-primary" onClick={closeMenu} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>{t('nav.register')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
