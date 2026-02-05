import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, RefreshCw, Lock, Unlock, AlertCircle, CheckCircle, User, KeyRound, Trophy } from 'lucide-react';
import SEO from '../components/SEO';

// Replace with your deployed Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjRmBXx72oj-LAJChM_hdOCu-vQnWftXlnOCORB_Ea7WytaF3xzWVQbqvWa9DLtLEZDA/exec';

// Admin credentials
const ADMIN_USERNAME = 'incepta';
const ADMIN_PASSWORD = 'incepta2026';
const ADMIN_KEY = 'incepta2026admin'; // For API calls

export default function FasttypingAdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);

    // Position is auto-calculated based on WPM and Accuracy
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        wpm: '',
        accuracy: ''
    });

    // Check localStorage for saved auth on mount
    useEffect(() => {
        const savedAuth = localStorage.getItem('incepta_admin_auth');
        if (savedAuth === 'true') {
            setIsAuthenticated(true);
            fetchLeaderboard();
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('incepta_admin_auth', 'true');
            setMessage({ type: '', text: '' });
            fetchLeaderboard();
        } else {
            setMessage({ type: 'error', text: 'Invalid username or password' });
        }
    };

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = await fetch(SCRIPT_URL);
            const data = await response.json();
            if (data.status === 'success') {
                setLeaderboard(data.data || []);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to fetch leaderboard' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Calculate preview score
    const calculateScore = () => {
        const wpm = parseInt(formData.wpm) || 0;
        const accuracy = parseFloat(formData.accuracy) || 0;
        return Math.round((wpm * (accuracy / 100)) * 100) / 100;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                body: JSON.stringify({
                    action: editingId ? 'update' : 'add',
                    adminKey: ADMIN_KEY,
                    data: {
                        name: formData.name,
                        department: formData.department,
                        wpm: parseInt(formData.wpm),
                        accuracy: parseFloat(formData.accuracy),
                        id: editingId
                    }
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                setMessage({ type: 'success', text: editingId ? 'Entry updated!' : 'Entry added!' });
                setFormData({ name: '', department: '', wpm: '', accuracy: '' });
                setEditingId(null);
                fetchLeaderboard();
            } else {
                setMessage({ type: 'error', text: result.message || 'Unknown error' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save entry' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry) => {
        setFormData({
            name: entry.name,
            department: entry.department,
            wpm: entry.wpm.toString(),
            accuracy: entry.accuracy.toString()
        });
        setEditingId(entry.id);
    };

    const handleDelete = async (entry) => {
        if (!window.confirm(`Delete ${entry.name} from leaderboard?`)) return;

        setLoading(true);
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                body: JSON.stringify({
                    action: 'delete',
                    adminKey: ADMIN_KEY,
                    data: { id: entry.id }
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                setMessage({ type: 'success', text: 'Entry deleted!' });
                fetchLeaderboard();
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete entry' });
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setFormData({ name: '', department: '', wpm: '', accuracy: '' });
        setEditingId(null);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
        setLeaderboard([]);
        localStorage.removeItem('incepta_admin_auth');
    };

    if (!isAuthenticated) {
        return (
            <div className="page-container">
                <SEO title="Admin Login - INCEPTA 2026" />
                <section className="page-hero" style={{ '--accent-color': '#ff6b6b' }}>
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                    <h1 className="page-title">Admin Login</h1>
                    <p className="page-subtitle">Sign in to manage INCEPTA 2026</p>
                </section>

                <section className="section admin-login-section">
                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="login-icon">
                            <Lock size={48} />
                        </div>
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">Enter your credentials to continue</p>

                        <div className="form-group">
                            <label htmlFor="username">
                                <User size={16} /> Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">
                                <KeyRound size={16} /> Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        {message.text && (
                            <div className={`message ${message.type}`}>
                                {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                                {message.text}
                            </div>
                        )}
                        <button type="submit" className="admin-login-btn">
                            <Unlock size={18} />
                            Sign In
                        </button>
                    </form>
                </section>
            </div>
        );
    }

    return (
        <div className="page-container">
            <SEO title="Admin Panel - Fasttyping Leaderboard" />

            <section className="page-hero" style={{ '--accent-color': '#ff6b6b' }}>
                <Link to="/competitions/fasttyping-leaderboard" className="back-link">
                    <ArrowLeft size={20} /> Back to Leaderboard
                </Link>
                <h1 className="page-title">Leaderboard Admin</h1>
                <p className="page-subtitle">Manage Fasttyping Leaderboard entries</p>
                <button className="logout-btn" onClick={handleLogout}>
                    <Lock size={16} /> Logout
                </button>
            </section>

            <section className="section admin-section">
                {/* Info Box */}
                <div className="admin-info-box">
                    <Trophy size={20} />
                    <span>Position is calculated automatically based on: <strong>Score = WPM × (Accuracy ÷ 100)</strong></span>
                </div>

                {/* Add/Edit Form */}
                <div className="admin-form-container">
                    <h2 className="admin-section-title">
                        {editingId ? <><Edit2 size={20} /> Edit Entry</> : <><Plus size={20} /> Add New Entry</>}
                    </h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Participant Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter participant name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="department">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    placeholder="e.g., CSE, ECE, ME"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="wpm">WPM (Words Per Minute)</label>
                                <input
                                    type="number"
                                    id="wpm"
                                    name="wpm"
                                    value={formData.wpm}
                                    onChange={handleInputChange}
                                    placeholder="85"
                                    min="0"
                                    max="300"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="accuracy">Accuracy (%)</label>
                                <input
                                    type="number"
                                    id="accuracy"
                                    name="accuracy"
                                    value={formData.accuracy}
                                    onChange={handleInputChange}
                                    placeholder="98.5"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Score Preview */}
                        {(formData.wpm || formData.accuracy) && (
                            <div className="score-preview">
                                <span className="score-label">Calculated Score:</span>
                                <span className="score-value">{calculateScore()}</span>
                            </div>
                        )}

                        {message.text && (
                            <div className={`message ${message.type}`}>
                                {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        <div className="form-actions">
                            {editingId && (
                                <button type="button" className="cancel-btn" onClick={cancelEdit}>
                                    <X size={18} /> Cancel
                                </button>
                            )}
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? <RefreshCw size={18} className="spinning" /> : <Save size={18} />}
                                {editingId ? 'Update Entry' : 'Add Entry'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Current Entries */}
                <div className="admin-entries-container">
                    <div className="entries-header">
                        <h2 className="admin-section-title">Current Entries ({leaderboard.length})</h2>
                        <button className="refresh-btn" onClick={fetchLeaderboard} disabled={loading}>
                            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                            Refresh
                        </button>
                    </div>

                    {leaderboard.length === 0 ? (
                        <div className="no-entries">
                            <p>No entries yet. Add your first participant above!</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Dept</th>
                                        <th>WPM</th>
                                        <th>Accuracy</th>
                                        <th>Score</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <tr key={index} className={entry.position <= 3 ? `rank-${entry.position}` : ''}>
                                            <td className="rank-cell-admin">
                                                <span className={`rank-badge rank-${entry.position <= 3 ? entry.position : 'default'}`}>
                                                    {entry.position}
                                                </span>
                                            </td>
                                            <td>{entry.name}</td>
                                            <td>{entry.department}</td>
                                            <td><strong>{entry.wpm}</strong></td>
                                            <td>{entry.accuracy}%</td>
                                            <td><span className="score-badge">{entry.score}</span></td>
                                            <td className="actions-cell">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEdit(entry)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(entry)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
