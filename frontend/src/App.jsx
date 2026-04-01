import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import ArticleDetails from './pages/ArticleDetails';
import MyArticles from './pages/MyArticles';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Navbar />
      <main className="main-content container animate-fade">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-articles" element={<PrivateRoute><MyArticles /></PrivateRoute>} />
          <Route path="/create-article" element={<PrivateRoute><CreateArticle /></PrivateRoute>} />
          <Route path="/edit-article/:id" element={<PrivateRoute><EditArticle /></PrivateRoute>} />
          <Route path="/article/:id" element={<ArticleDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
