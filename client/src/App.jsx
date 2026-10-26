import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import IncidentIntake from './components/IncidentIntake';
import DossierView from './components/DossierView';
import OfficerDashboard from './components/OfficerDashboard';
import FIRPrintView from './components/FIRPrintView';
import LoginPage from './components/LoginPage';
import StatsView from './components/StatsView';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/login') return 'login';
      if (window.location.pathname === '/officer') return 'officer';
      if (window.location.pathname === '/stats') return 'stats';
    }
    return 'intake';
  }); // 'intake' | 'dossier' | 'officer' | 'fir' | 'login' | 'stats'

  const [currentReport, setCurrentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cyberkavach_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/login') {
        setActiveTab('login');
      } else if (window.location.pathname === '/officer') {
        setActiveTab('officer');
      } else if (window.location.pathname === '/stats') {
        setActiveTab('stats');
      } else {
        setActiveTab('intake');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'login') {
      window.history.pushState({}, '', '/login');
    } else if (tab === 'officer') {
      window.history.pushState({}, '', '/officer');
    } else if (tab === 'stats') {
      window.history.pushState({}, '', '/stats');
    } else if (tab === 'intake') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cyberkavach_user');
    setCurrentUser(null);
    setCurrentReport(null);
    navigateToTab('login');
  };

  const handleTriageSuccess = (report) => {
    setCurrentReport(report);
    setActiveTab('dossier');
    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.5 }
    });
  };

  const handleSelectReportFromOfficer = (report) => {
    setCurrentReport(report);
    setActiveTab('dossier');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Official Clean Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        currentUser={currentUser}
        onOpenAuth={() => navigateToTab('login')}
        onLogout={handleLogout}
        hasReport={!!currentReport}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'officer') {
                navigateToTab('officer');
              } else {
                navigateToTab('intake');
              }
            }}
            onNavigateHome={() => navigateToTab('intake')}
          />
        )}

        {activeTab === 'intake' && (
          <IncidentIntake
            onTriageSuccess={handleTriageSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            currentUser={currentUser}
            onRequireAuth={() => navigateToTab('login')}
          />
        )}

        {activeTab === 'dossier' && (
          <DossierView
            report={currentReport}
            onBack={() => navigateToTab('intake')}
            onOpenFIR={() => setActiveTab('fir')}
          />
        )}

        {activeTab === 'fir' && (
          <FIRPrintView
            report={currentReport}
            onBack={() => setActiveTab('dossier')}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerDashboard
            currentUser={currentUser}
            onOfficerLoginSuccess={(officerUser) => {
              setCurrentUser(officerUser);
            }}
            onOfficerLogout={handleLogout}
            onSelectReport={handleSelectReportFromOfficer}
          />
        )}

        {activeTab === 'stats' && <StatsView />}
      </main>

      {/* Official Public Service Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-light)',
          background: '#FFFFFF',
          padding: '24px 20px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)' }}>
            CyberKavach — National Citizen Cybercrime Triage & Golden-Hour Fraud Response Portal
          </p>
          <p style={{ marginTop: 4, color: 'var(--text-secondary)' }}>
            Statutory penal classification compliant with Information Technology Act, 2000 & Bharatiya Nyaya Sanhita (BNS), 2023.
          </p>
          <p style={{ marginTop: 6, fontSize: '0.78rem' }}>
            National Cyber Crime Reporting Portal Helpline: <strong>1930</strong> • Official Portal:{' '}
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              cybercrime.gov.in
            </a>
            {' '}•{' '}
            <button
              type="button"
              onClick={() => navigateToTab('officer')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: 'inherit',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              Cyber Cell Officer Terminal
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}
