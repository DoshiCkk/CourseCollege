import { Link } from 'react-router-dom';

const statusCodeData = {
  400: { title: "Bad Request", message: "The server couldn't understand your request due to invalid syntax." },
  401: { title: "Unauthorized", message: "You need to log in to access this resource." },
  403: { title: "Forbidden", message: "You don't have permission to access or modify this content." },
  404: { title: "Page Not Found", message: "The page you're looking for has vanished into the dark web." },
  500: { title: "Internal Server Error", message: "Oops! Something blew up on our end. Our engineers are on it." },
  503: { title: "Service Unavailable", message: "The server is temporarily down for maintenance or overloaded." }
};

const ErrorPage = ({ code }) => {
  const data = statusCodeData[code] || { title: "Unexpected Error", message: "Something went wrong." };
  
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
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>{data.title}</h2>
        <p className="text-secondary" style={{ fontSize: '1.15rem', maxWidth: '500px', margin: '0 auto 40px auto' }}>
          {data.message}
        </p>
        <Link to="/" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
          &larr; Return to Safety
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
