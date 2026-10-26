import React from 'react';
import { Shield, PhoneCall, LogIn, LogOut, ShieldAlert, FileText, Building2, BarChart3 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth, onLogout, hasReport }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-wrapper" onClick={() => setActiveTab('intake')}>
          <div className="brand-emblem">
            <Shield size={20} strokeWidth={2.4} />
          </div>
          <div className="brand-titles">
            <h1>
              CyberKavach
              <span className="gov-badge">Triage</span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'intake' ? 'active' : ''}`}
            onClick={() => setActiveTab('intake')}
          >
            <ShieldAlert size={15} />
            <span>Report Fraud</span>
          </button>

          {hasReport && (
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'dossier' || activeTab === 'fir' ? 'active' : ''}`}
              onClick={() => setActiveTab('dossier')}
            >
              <FileText size={15} />
              <span>Active Case</span>
            </button>
          )}

          {currentUser?.role === 'officer' && (
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'officer' ? 'active' : ''}`}
              onClick={() => setActiveTab('officer')}
            >
              <Building2 size={15} />
              <span>Police Desk</span>
            </button>
          )}

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={15} />
            <span>Defense Stats</span>
          </button>
        </nav>

        {/* Right Section: Helpline & Auth */}
        <div className="nav-actions">
          <a href="tel:1930" className="helpline-quick-btn" title="Call National Cyber Helpline 1930">
            <PhoneCall size={14} />
            <span>1930</span>
          </a>

          {currentUser ? (
            <div className="user-badge-pill">
              <span className="user-avatar-circle">
                {currentUser.role === 'officer' ? '👮' : '👤'}
              </span>
              <span className="user-name-text">{currentUser.name?.split(' ')[0] || 'User'}</span>
              <button
                type="button"
                onClick={onLogout}
                title="Sign out"
                className="user-logout-btn"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-auth-trigger"
              onClick={onOpenAuth}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
