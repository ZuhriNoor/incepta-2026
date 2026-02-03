import { useState } from 'react';

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, LayoutDashboard, MapPin, BrainCircuit, ShieldCheck, Zap, Sparkles, Image, Presentation, Bot, Palette, MonitorPlay, Compass, Music, Mic, Users, Award, Calendar, Clock } from 'lucide-react';
import { eventsData, eventCategories } from '../eventsData';
import SEO from '../components/SEO';

const iconMap = {
    layoutDashboard: LayoutDashboard,
    mapPin: MapPin,
    brainCircuit: BrainCircuit,
    shieldCheck: ShieldCheck,
    zap: Zap,
    sparkles: Sparkles,
    image: Image,
    presentation: Presentation,
    bot: Bot,
    palette: Palette,
    monitorPlay: MonitorPlay,
    compass: Compass,
    music: Music,
    mic: Mic,
    users: Users,
    award: Award,
    calendar: Calendar,
    clock: Clock
};

// Get back link based on event category
function getBackLink(category) {
    switch (category) {
        case 'competitions':
            return { path: '/competitions', label: 'Competitions' };
        case 'egames':
            return { path: '/competitions/egames', label: 'E-Games' };
        case 'workshops':
            return { path: '/events', label: 'Events' };
        case 'gala':
            return { path: '/gala', label: 'Home' };
        default:
            return { path: '/', label: 'Home' };
    }
}

// Get category color
function getCategoryColor(category) {
    return eventCategories[category]?.color || '#c678ff';
}

export default function EventDetailPage() {
    const { eventId } = useParams();
    const [openSections, setOpenSections] = useState({});

    const event = eventsData[eventId];

    // Event not found
    if (!event) {
        return (
            <div className="page-container">
                <SEO title="Event Not Found" />
                <section className="page-hero" style={{ '--accent-color': '#ff6b6b' }}>
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                    <h1 className="page-title">Event Not Found</h1>
                    <p className="page-subtitle">The event you're looking for doesn't exist.</p>
                </section>
            </div>
        );
    }

    const backInfo = getBackLink(event.category);
    const categoryColor = getCategoryColor(event.category);
    const Icon = iconMap[event.icon] || LayoutDashboard;

    const toggleSection = (sectionIndex) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex]
        }));
    };

    return (
        <div className="page-container event-detail-page">
            <SEO
                title={event.title}
                description={event.description}
                keywords={event.badge}
            />

            <section className="page-hero" style={{ '--accent-color': categoryColor }}>
                <div className="event-header-row">
                    <Link to={backInfo.path} className="back-link">
                        <ArrowLeft size={18} /> Back to {backInfo.label}
                    </Link>
                    <div className="event-detail-badge">{event.badge}</div>
                </div>

                <h1 className="page-title">{event.title}</h1>
                <p className="page-subtitle">{event.tagline}</p>
            </section>

            <section className="event-detail-content">
                {/* Special Layout for Applied AI & Agentic AI (Inauguration Style) */}
                {['appliedai', 'agenticaiworkshop'].includes(eventId) ? (
                    <div className="glass-card mb-12">
                        <div className="bg-decoration-1"></div>
                        <div className="bg-decoration-2"></div>
                        <div className="inauguration-grid">
                            {/* Tutor Image Section (Right Side in Inauguration Grid) */}
                            <div className="speaker-image-wrapper">
                                <div className="speaker-frame static">
                                    <img
                                        src={event.tutors?.[0]?.image}
                                        alt={event.tutors?.[0]?.name}
                                        className="speaker-img"
                                        style={{
                                            transform: `scale(${event.tutors?.[0]?.zoom || 1})`,
                                            objectPosition: event.tutors?.[0]?.position || 'center'
                                        }}
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(event.tutors?.[0]?.name || 'Tutor')}&background=885DA4&color=fff&size=400`;
                                        }}
                                    />
                                    <div className="image-overlay"></div>
                                    <div className="speaker-info-overlay">
                                        <h3 className="speaker-name">{event.tutors?.[0]?.name?.toUpperCase()}</h3>
                                        <p className="speaker-role">{event.tutors?.[0]?.designation}</p>
                                    </div>
                                </div>
                                <div className="floating-badge">
                                    <Users size={16} /> Tutor
                                </div>
                            </div>

                            {/* About Content Section (Left Side in Inauguration Grid) */}
                            <div className="content-wrapper">
                                <div className="meta-info">
                                    {event.details?.map((detail, index) => (
                                        <div className={`meta-pill pill-${index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'pink'}`} key={index}>
                                            {detail.label === 'Date' && <Calendar size={16} />}
                                            {detail.label === 'Time' && <Clock size={16} />}
                                            {detail.label === 'Venue' && <MapPin size={16} />}
                                            <span>{detail.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="talk-title">About This Workshop</h3>
                                <div className="description-text">
                                    <p>{event.description}</p>
                                    {event.highlights && (
                                        <ul className="modern-list">
                                            {event.highlights.map((highlight, index) => (
                                                <li key={index}>{highlight}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Details Grid */}
                        <div className="overlay-details-grid">
                            {event.details?.map((detail, index) => (
                                <div className="overlay-detail-card" key={index}>
                                    <h4>{detail.label}</h4>
                                    <p>{detail.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* About Section */}
                        <div className="overlay-description">
                            <h3>About This Event</h3>
                            <p>{event.description}</p>
                            {event.highlights && (
                                <ul>
                                    {event.highlights.map((highlight, index) => (
                                        <li key={index}>{highlight}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}

                {/* Panelists Section - Show for all events if they have it, EXCEPT appliedai which now has its custom view */}
                {event.panelists && eventId !== 'appliedai' && (
                    <div className="overlay-description">
                        <div className="section-header-inline">
                            <h3>Panelists</h3>
                            <div className="header-line"></div>
                        </div>
                        <div className="panelists-grid">
                            {event.panelists.map((panelist, index) => (
                                <div className="panelist-card-refined" key={index}>
                                    <div className="panelist-frame">
                                        <img
                                            src={panelist.image}
                                            alt={panelist.name}
                                            className="panelist-img-refined"
                                            style={{
                                                objectPosition: 'top center'
                                            }}
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(panelist.name)}&background=885DA4&color=fff&size=400`;
                                            }}
                                        />
                                        <div className="panelist-overlay"></div>
                                        <div className="panelist-info-refined">
                                            <h4>{panelist.name}</h4>
                                            <p>{panelist.designation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tutors Section - Show for all events EXCEPT appliedai & agenticaiworkshop (already shown in special layout) */}
                {event.tutors && !['appliedai', 'agenticaiworkshop'].includes(eventId) && (
                    <div className="overlay-description">
                        <div className="section-header-inline">
                            <h3>Tutor</h3>
                            <div className="header-line"></div>
                        </div>
                        <div className="panelists-grid">
                            {event.tutors.map((tutor, index) => (
                                <div className="panelist-card-refined" key={index}>
                                    <div className="panelist-frame">
                                        <img
                                            src={tutor.image}
                                            alt={tutor.name}
                                            className="panelist-img-refined"
                                            style={{
                                                objectPosition: 'top center'
                                            }}
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=885DA4&color=fff&size=400`;
                                            }}
                                        />
                                        <div className="panelist-overlay"></div>
                                        <div className="panelist-info-refined">
                                            <h4>{tutor.name}</h4>
                                            <p>{tutor.designation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rules & Guidelines (Accordion) */}
                {event.rulesAndGuidelines &&
                    typeof event.rulesAndGuidelines === 'object' && (
                        <div className="overlay-description">
                            <h3>Rules & Guidelines</h3>
                            <div className="accordion-container">
                                {Object.entries(event.rulesAndGuidelines).map(
                                    ([sectionTitle, rules], index) => (
                                        <div
                                            className={`accordion-item ${openSections[index] ? 'open' : ''}`}
                                            key={index}
                                        >
                                            <button
                                                className="accordion-header"
                                                onClick={() => toggleSection(index)}
                                            >
                                                <h4>
                                                    {sectionTitle
                                                        .replace(/([A-Z])/g, ' $1')
                                                        .replace(/^./, str => str.toUpperCase())}
                                                </h4>
                                                {openSections[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                            <div className="accordion-content">
                                                <div className="accordion-inner">
                                                    <ul>
                                                        {Array.isArray(rules) &&
                                                            rules.map((rule, i) => (
                                                                <li key={i}>{rule}</li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                {/* Judging Criteria */}
                {event.judgingCriteria && (
                    <div className="overlay-description">
                        <h3>Judging Criteria</h3>
                        <ul>
                            {event.judgingCriteria.map((criteria, index) => (
                                <li key={index}>{criteria}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Prizes */}
                {event.prizes && (
                    <div className="overlay-description">
                        <h3>Prizes</h3>
                        <ul>
                            {event.prizes.map((prize, index) => {
                                const isSubItem = prize.trim().startsWith('•') || prize.startsWith('  ');
                                return (
                                    <li key={index} className={isSubItem ? 'sub-item' : ''}>
                                        {prize}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Contact Section */}
                {event.contact && event.contact.coordinators && (
                    <div className="overlay-description">
                        <h3>Contact</h3>
                        <div className="overlay-details-grid contact-grid">
                            {event.contact.coordinators.map((person, index) => (
                                <div className="overlay-detail-card" key={index}>
                                    <h4>{person.name}</h4>
                                    <p>📞 {person.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <div className="floating-cta">
                <a
                    href={event.registrationUrl}
                    className="floating-register-btn"
                    style={{ '--accent-color': categoryColor }}
                >
                    {event.buttonText}
                    <ArrowRight size={20} />
                </a>
            </div>
        </div>
    );
}
