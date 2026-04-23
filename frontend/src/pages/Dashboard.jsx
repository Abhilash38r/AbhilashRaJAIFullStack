import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { LogOut, Search, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Setup Axios with Token
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  });

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await api.get('/grievances');
      setGrievances(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch grievances');
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/grievances/search?title=${searchTerm}`);
      setGrievances(res.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isEditing) {
        await api.put(`/grievances/${editId}`, formData);
        setIsEditing(false);
        setEditId(null);
      } else {
        await api.post('/grievances', formData);
      }
      
      setFormData({ title: '', description: '', category: 'Academic' });
      fetchGrievances(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save grievance');
    }
  };

  const handleEdit = (grievance) => {
    setIsEditing(true);
    setEditId(grievance._id);
    setFormData({
      title: grievance.title,
      description: grievance.description,
      category: grievance.category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await api.delete(`/grievances/${id}`);
        fetchGrievances();
      } catch (err) {
        setError('Failed to delete grievance');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      {/* Header */}
      <header className="flex justify-between items-center mb-4 glass-card" style={{ padding: '1.5rem' }}>
        <div>
          <h2>Student Dashboard</h2>
          <p>Welcome, {user?.name}</p>
        </div>
        <button onClick={logout} className="btn btn-danger flex items-center gap-4" style={{ gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid var(--danger-color)' }}>
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Left Column: Form */}
        <div className="glass-card animate-fade-in" style={{ height: 'fit-content' }}>
          <h3 className="flex items-center" style={{ gap: '0.5rem' }}>
            <Plus size={20} color="var(--primary-color)" />
            {isEditing ? 'Edit Grievance' : 'Submit Grievance'}
          </h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                type="text" 
                name="title" 
                className="form-control" 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                name="category" 
                className="form-control" 
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                name="description" 
                className="form-control" 
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              {isEditing ? 'Update Grievance' : 'Submit'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                className="btn btn-block mt-4" 
                style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ title: '', description: '', category: 'Academic' });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Right Column: List & Search */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Search Bar */}
          <div className="glass-card mb-4 flex items-center" style={{ padding: '1rem', gap: '1rem' }}>
            <form onSubmit={handleSearch} className="flex" style={{ width: '100%', gap: '1rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search grievances by title..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary flex items-center" style={{ gap: '0.5rem' }}>
                <Search size={18} /> Search
              </button>
              {searchTerm && (
                <button 
                  type="button" 
                  className="btn" 
                  style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  onClick={() => {
                    setSearchTerm('');
                    fetchGrievances();
                  }}
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* Grievance List */}
          <div className="grid grid-cols-1">
            {loading ? (
              <div className="glass-card text-center">Loading grievances...</div>
            ) : grievances.length === 0 ? (
              <div className="glass-card text-center" style={{ color: 'var(--text-secondary)' }}>
                No grievances found.
              </div>
            ) : (
              grievances.map((grievance) => (
                <div key={grievance._id} className="glass-card" style={{ padding: '1.5rem', transition: 'transform 0.2s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{grievance.title}</h3>
                    <div className="flex gap-4">
                      <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>{grievance.category}</span>
                      <span className={`badge ${grievance.status === 'Resolved' ? 'badge-resolved' : 'badge-pending'} flex items-center`} style={{ gap: '0.25rem' }}>
                        {grievance.status === 'Resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {grievance.status}
                      </span>
                    </div>
                  </div>
                  
                  <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>{grievance.description}</p>
                  
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(grievance.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleEdit(grievance)}
                        className="btn" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}
                      >
                        <Edit2 size={14} style={{ marginRight: '0.25rem' }} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(grievance._id)}
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                      >
                        <Trash2 size={14} style={{ marginRight: '0.25rem' }} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
