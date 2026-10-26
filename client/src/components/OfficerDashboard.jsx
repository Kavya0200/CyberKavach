import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  Lock,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Mail,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import API_BASE_URL from '../config/api';

export default function OfficerDashboard({ onSelectReport, currentUser, onOfficerLoginSuccess, onOfficerLogout }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Officer Login Gate State
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [officerError, setOfficerError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const isOfficerAuthenticated = currentUser && currentUser.role === 'officer';

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports`);
      const json = await res.json();
      if (json.success) {
        setReports(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOfficerAuthenticated) {
      fetchReports();
    }
  }, [isOfficerAuthenticated]);

  const handleOfficerLogin = async (e) => {
    e.preventDefault();
    setOfficerError('');
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: officerEmail, password: officerPassword })
      });
      const data = await res.json();

      if (data.success) {
        if (data.user.role !== 'officer') {
          setOfficerError('Access Restricted: This terminal is strictly reserved for authorized Cyber Cell Police Officers.');
          return;
        }
        localStorage.setItem('cyberkavach_user', JSON.stringify(data.user));
        if (onOfficerLoginSuccess) {
          onOfficerLoginSuccess(data.user);
        }
      } else {
        setOfficerError(data.error || 'Authentication failed. Please verify police service credentials.');
      }
    } catch (err) {
      console.error('Officer auth error:', err);
      setOfficerError('Connection to police terminal server failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoOfficerFill = () => {
    setOfficerEmail('officer@cyberkavach.gov.in');
    setOfficerPassword('police123');
    setOfficerError('');
  };

  const handleStatusUpdate = async (id, newStatus, note) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note,
          performedBy: currentUser?.name || 'Cyber Cell Officer Inspector Deshmukh'
        })
      });
      const json = await res.json();
      if (json.success) {
        if (newStatus === 'FUNDS_FROZEN') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
        await fetchReports();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.complaintId?.toLowerCase().includes(q) ||
      r.victim?.name?.toLowerCase().includes(q) ||
      r.financialDetails?.utrNumber?.toLowerCase().includes(q) ||
      r.incident?.fraudCategory?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Dedicated Officer Login Gate
  if (!isOfficerAuthenticated) {
    return (
      <div className="page-container" style={{ maxWidth: 480, margin: '30px auto', padding: '0 16px' }}>
        <div className="form-card" style={{ padding: '32px 24px', borderTop: '4px solid var(--primary)' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-md)',
                background: '#1E3A5F',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <ShieldCheck size={28} strokeWidth={2.4} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
              Cyber Cell Officer Terminal
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Authorized Police Personnel Only. Sign in to track live NCRP fraud incidents and issue bank freeze requisitions.
            </p>
          </div>

          {/* 1-Click Officer Demo Button */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Officer Demo:
              </span>
              <button
                type="button"
                className="compact-preset-btn"
                style={{ padding: '5px 12px', fontWeight: 700 }}
                onClick={handleDemoOfficerFill}
              >
                👮 Fill Demo Officer Credentials
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {officerError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: 16 }}>
              {officerError}
            </div>
          )}

          <form onSubmit={handleOfficerLogin}>
            <div style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Official Police Email ID</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="officer@cyberkavach.gov.in"
                  value={officerEmail}
                  onChange={(e) => setOfficerEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Service Password / Access PIN</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-dim)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="••••••••"
                  value={officerPassword}
                  onChange={(e) => setOfficerPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit-action"
              style={{ width: '100%', justifyContent: 'center', background: '#1E3A5F' }}
              disabled={authLoading}
            >
              <ShieldCheck size={16} />
              <span>{authLoading ? 'Verifying Terminal Access...' : 'Authenticate Officer Terminal'}</span>
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔒 Protected under Information Technology Act §70 (Designated Protected System).
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Officer Tracking Dashboard
  return (
    <div className="page-container">
      {/* Officer Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="meta-pill blue">
              <ShieldCheck size={12} />
              NCRP Live Incident Queue
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Logged in: <strong>{currentUser?.name}</strong> (Cyber Crime Unit)
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)' }}>
            Cyber Fraud Triage & Asset Freeze Console
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn-action-secondary" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }} onClick={fetchReports} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Queue</span>
          </button>
          {onOfficerLogout && (
            <button
              type="button"
              className="btn-action-secondary"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem', color: '#DC2626' }}
              onClick={onOfficerLogout}
              title="Lock Officer Terminal"
            >
              <LogOut size={13} />
              <span>Lock Terminal</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="form-card" style={{ padding: '14px 18px', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: 240 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search by Complaint ID, 12-digit UTR, or Complainant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['ALL', 'TRIAGED', 'BANK_NOTIFIED', 'FUNDS_FROZEN'].map((st) => (
              <button
                key={st}
                className="compact-preset-btn"
                style={{
                  background: filterStatus === st ? 'var(--primary)' : '#FFFFFF',
                  color: filterStatus === st ? '#FFFFFF' : 'var(--text-secondary)',
                  borderColor: filterStatus === st ? 'var(--primary)' : 'var(--border-subtle)',
                  fontWeight: filterStatus === st ? 700 : 500
                }}
                onClick={() => setFilterStatus(st)}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="data-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="officer-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Complainant</th>
                <th>Fraud Classification</th>
                <th>Disputed Loss</th>
                <th>12-Digit UTR</th>
                <th>Current Status</th>
                <th>Officer Directives</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
                    No incident records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => {
                  const isUpdating = updatingId === r.complaintId;
                  const amt = Number(r.incident?.amountLost || 0).toLocaleString('en-IN');

                  return (
                    <tr key={r.complaintId}>
                      {/* Ticket ID */}
                      <td>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>
                          {r.complaintId}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </div>
                      </td>

                      {/* Complainant */}
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.victim?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {r.victim?.city}, {r.victim?.state}
                        </div>
                      </td>

                      {/* Fraud Category */}
                      <td>
                        <span style={{ fontSize: '0.75rem', background: '#F1F5F9', color: '#1E293B', padding: '3px 8px', borderRadius: 4, border: '1px solid #E2E8F0', fontWeight: 600 }}>
                          {r.incident?.fraudCategory}
                        </span>
                      </td>

                      {/* Amount Lost */}
                      <td>
                        <span style={{ fontWeight: 800, color: '#DC2626' }}>
                          ₹{amt}
                        </span>
                      </td>

                      {/* UTR */}
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', background: '#F8FAFC', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-light)' }}>
                          {r.financialDetails?.utrNumber || 'PENDING'}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-badge ${r.status}`}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action Directives */}
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className="btn-action-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                            onClick={() => onSelectReport(r)}
                          >
                            <ExternalLink size={12} />
                            View
                          </button>

                          {r.status !== 'BANK_NOTIFIED' && r.status !== 'FUNDS_FROZEN' && (
                            <button
                              className="btn-action-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                              onClick={() => handleStatusUpdate(r.complaintId, 'BANK_NOTIFIED', 'Formal notice transmitted to Nodal Bank officer.')}
                              disabled={isUpdating}
                            >
                              <Building2 size={12} />
                              Notify Bank
                            </button>
                          )}

                          {r.status !== 'FUNDS_FROZEN' && (
                            <button
                              className="btn-action-primary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto', background: '#059669' }}
                              onClick={() => handleStatusUpdate(r.complaintId, 'FUNDS_FROZEN', 'Confirmed lien and debit-freeze placed on suspect account.')}
                              disabled={isUpdating}
                            >
                              <Lock size={12} />
                              Freeze Funds
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
