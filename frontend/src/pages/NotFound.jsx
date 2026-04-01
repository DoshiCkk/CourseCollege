import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex-col items-center justify-center animate-fade" style={{ flexGrow: 1, paddingTop: '100px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--accent)', margin: '0' }}>404</h1>
      <h2 className="mb-4" style={{ fontSize: '2rem' }}>Page Not Found</h2>
      <p className="text-secondary mb-6 mx-auto" style={{ maxWidth: '500px', margin: '0 auto 24px auto' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary" style={{ width: 'auto', display: 'inline-block', letterSpacing: '0.5px' }}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
