import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      return setError('Please fill in all fields');
    }

    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <UserPlus size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
          <h2>Create Account</h2>
          <p>Register to submit grievances</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--danger-color)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control" 
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Register
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
