import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Crown, Keyboard, RefreshCw, AlertCircle, Zap, Target } from 'lucide-react';
import SEO from '../components/SEO';

// Replace with your deployed Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjRmBXx72oj-LAJChM_hdOCu-vQnWftXlnOCORB_Ea7WytaF3xzWVQbqvWa9DLtLEZDA/exec';

export default function FasttypingLeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(SCRIPT_URL);
            const data = await response.json();
            if (data.status === 'success') {
                setLeaderboard(data.data || []);
                setLastUpdated(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
            } else {
                setError(data.message || 'Failed to fetch leaderboard');
            }
        } catch (err) {
            setError('Unable to load leaderboard. Please try again later.');
            console.error('Leaderboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const getRankIcon = (position) => {
        const renderIcon = () => {
            switch (position) {
                case 1: return <Crown className="rank-icon gold" size={20} />;
                case 2: return <Medal className="rank-icon silver" size={18} />;
                case 3: return <Medal className="rank-icon bronze" size={16} />;
                default: return null;
            }
        };

        return (
            <div className="rank-container">
                <span className="rank-number">{position}</span>
                <div className="rank-icon-placeholder">
                    {renderIcon()}
                </div>
            </div>
        );
    };

    const getRankClass = (position) => {
        switch (position) {
            case 1: return 'rank-gold';
            case 2: return 'rank-silver';
            case 3: return 'rank-bronze';
            default: return '';
        }
    };

    // Get top 3 for podium display
    const topThree = leaderboard.slice(0, 3);
    // Show all in the table as requested
    const fullList = leaderboard;

    return (
        <div className="page-container">
            <SEO
                title="Fasttyping Leaderboard"
                description="View the fastest typists rankings at INCEPTA 2026. See top performers and their WPM scores."
            />

            {/* Hero Section */}
            <section className="page-hero" style={{ '--accent-color': '#00d4ff' }}>
                <Link to="/competitions" className="back-link">
                    <ArrowLeft size={20} /> Back to Competitions
                </Link>
                <div className="hero-icon-container">
                    <Keyboard size={48} className="hero-section-icon" />
                </div>
                <h1 className="page-title">Fasttyping Leaderboard</h1>
                <p className="page-subtitle">The fastest fingers in INCEPTA 2026</p>
            </section>

            {/* Leaderboard Section */}
            <section className="section leaderboard-section">
                <div className="leaderboard-header">
                    <div className="leaderboard-stats">
                        <Trophy size={20} />
                        <span>{leaderboard.length} Participants</span>
                    </div>
                    <button
                        className="refresh-btn"
                        onClick={fetchLeaderboard}
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="leaderboard-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading leaderboard...</p>
                    </div>
                ) : error ? (
                    <div className="leaderboard-error">
                        <AlertCircle size={48} />
                        <h3>Oops! Something went wrong</h3>
                        <p>{error}</p>
                        <button className="retry-btn" onClick={fetchLeaderboard}>
                            Try Again
                        </button>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="leaderboard-empty">
                        <Keyboard size={64} className="empty-icon" />
                        <h3>Not Updated</h3>
                        <p>The leaderboard has not been updated yet. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        {topThree.length > 0 && (
                            <div className="podium-container">
                                {topThree.map((entry, index) => (
                                    <div
                                        key={index}
                                        className={`podium-card podium-${entry.position}`}
                                    >
                                        <div className="podium-rank">
                                            {getRankIcon(entry.position)}
                                        </div>
                                        <h3 className="podium-name">{entry.name}</h3>
                                        <p className="podium-department">{entry.department}</p>
                                        <div className="podium-stats">
                                            <div className="podium-stat">
                                                <Zap size={16} />
                                                <span className="stat-value">{entry.wpm}</span>
                                                <span className="stat-label">WPM</span>
                                            </div>
                                            <div className="podium-stat">
                                                <Target size={16} />
                                                <span className="stat-value">{entry.accuracy}%</span>
                                                <span className="stat-label">Accuracy</span>
                                            </div>
                                        </div>
                                        <div className="podium-score">
                                            Score: <strong>{entry.score}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Rest of Leaderboard */}
                        {fullList.length > 0 && (
                            <div className="leaderboard-table-container">
                                <table className="leaderboard-table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Name</th>
                                            <th>Dept</th>
                                            <th>WPM</th>
                                            <th>Accuracy</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fullList.map((entry, index) => (
                                            <tr
                                                key={index}
                                                className={`leaderboard-row ${getRankClass(entry.position)}`}
                                            >
                                                <td className="rank-cell">
                                                    {getRankIcon(entry.position)}
                                                </td>
                                                <td className="name-cell">{entry.name}</td>
                                                <td className="dept-cell">{entry.department}</td>
                                                <td className="wpm-cell">
                                                    <span className="wpm-value">{entry.wpm}</span>
                                                    <span className="wpm-label">WPM</span>
                                                </td>
                                                <td className="accuracy-cell">
                                                    <span className="accuracy-value">{entry.accuracy}%</span>
                                                </td>
                                                <td className="score-cell">
                                                    <span className="score-value-table">{entry.score}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* If only top 3, show a message */}
                        {leaderboard.length <= 3 && leaderboard.length > 0 && (
                            <p className="leaderboard-note">
                                More participants will appear here as they compete!
                            </p>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
