
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Clock, MapPin } from 'lucide-react';

export default function PanelDiscussion() {
    return (
        <section className="section panel-section" style={{ '--accent-color': '#885DA4' }}>
            <div className="panel-glow-1"></div>
            <div className="panel-glow-2"></div>

            <div className="panel-container">
                <div className="panel-grid">

                    {/* Content Side */}
                    <div className="panel-content-wrapper">
                        <div className="panel-badge">
                            <Users size={16} />
                            <span>In-Depth Discussion</span>
                        </div>

                        <h2 className="panel-title">
                            <span className="panel-title-gradient">
                                Panel Discussion
                            </span>
                        </h2>

                        <p className="panel-description">
                            Join industry leaders and academic pioneers as they explore the transformative impact of AI on education and the future workforce. A thought-provoking session you cannot afford to miss.
                        </p>

                        <div className="panel-details">
                            <div className="panel-detail-item">
                                <div className="detail-header" style={{ color: '#61dafb' }}>
                                    <Calendar size={18} />
                                    <span>Date</span>
                                </div>
                                <p>February 5, 2026</p>
                            </div>
                            <div className="panel-detail-item">
                                <div className="detail-header" style={{ color: '#ff6ac1' }}>
                                    <Clock size={18} />
                                    <span>Time</span>
                                </div>
                                <p>2:00 PM - 4:00 PM</p>
                            </div>
                        </div>

                    </div>

                    {/* Image Side */}
                    <div className="panel-image-wrapper">
                        <div className="panel-image-glow"></div>
                        <div className="panel-image-frame">
                            <img
                                src="/pannel-team.png"
                                alt="Panel Discussion Team"
                                className="panel-image"
                            />
                            {/* Overlay Gradient */}
                            <div className="panel-image-overlay"></div>

                            {/* Floating Badge */}
                            <div className="panel-image-badge">
                                <div className="badge-content">
                                    <p className="badge-title">Panelists</p>
                                    <p className="badge-subtitle">Industry Experts & Academicians</p>
                                </div>
                                <div className="badge-icon">
                                    <MapPin size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
