import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="container" style={{padding: '2rem', textAlign: 'center'}}>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  
  return children;
};

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
