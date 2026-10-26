import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Scale,
  Building2,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function StatsView() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stats`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setStats(json.data);
      })
      .catch((err) => console.error('Failed to load stats:', err));
  }, []);

  return (
    <div className="page-container">
      {/* Official Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="meta-pill blue" style={{ display: 'inline-flex', margin: '0 auto 10px auto' }}>
          <ShieldCheck size={13} />
          National Cybercrime Reporting Metrics (NCRP)
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
          National Cyber Fraud Defense Analytics
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 700, margin: '4px auto 0 auto' }}>
          Macro statistics tracking Golden-Hour intervention efficacy and criminal asset freezes across India.
        </p>
      </div>

      {/* 4 Big Metrics */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-item" style={{ borderLeft: '4px solid #1E3A5F' }}>
          <div className="stat-icon" style={{ background: '#EFF6FF', color: '#1E3A5F' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-number">
              {stats ? (stats.totalComplaints || 0).toLocaleString('en-IN') : '0'}
            </div>
            <div className="stat-label">Total Complaints Processed</div>
          </div>
        </div>

        <div className="stat-item" style={{ borderLeft: '4px solid #059669' }}>
          <div className="stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="stat-number">
              ₹{stats ? Number(stats.totalFundsProtected || 0).toLocaleString('en-IN') : '0'}
            </div>
            <div className="stat-label">Monetary Loss Frozen (Lien)</div>
          </div>
        </div>

        <div className="stat-item" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-number">
              {stats?.goldenHourSuccessRate || '0%'}
            </div>
            <div className="stat-label">Golden-Hour Recovery Rate</div>
          </div>
        </div>

        <div className="stat-item" style={{ borderLeft: '4px solid #DC2626' }}>
          <div className="stat-icon" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-number">58 Seconds</div>
            <div className="stat-label">Average Triage Time</div>
          </div>
        </div>
      </div>

      {/* Statutory Guidance */}
      <div className="form-card" style={{ padding: '28px 32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Scale size={22} />
          Statutory Framework for Cyber Fraud Recovery in India
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          Under Indian penal law and Reserve Bank of India (RBI) directives, victims of electronic banking fraud have clear legal mechanisms to secure restitution, provided rapid notice is served:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ background: '#1E3A5F', color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                1
              </div>
              <h4 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 800 }}>
                The 1930 NCRP Mechanism
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              When a citizen provides the 12-digit UTR within 2 hours, the National Cybercrime Reporting Portal triggers an automated electronic signal to the beneficiary bank to place a debit freeze before cash is withdrawn at an ATM.
            </p>
          </div>

          <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ background: '#D97706', color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                2
              </div>
              <h4 style={{ color: 'var(--saffron)', fontSize: '0.95rem', fontWeight: 800 }}>
                IT Act §66D & BNS §318(4)
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Cheating by electronic personation and fraudulent inducement are cognizable, non-bailable offenses under the Information Technology Act and Bharatiya Nyaya Sanhita, enabling police to freeze mule accounts immediately without awaiting trial.
            </p>
          </div>

          <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ background: '#059669', color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                3
              </div>
              <h4 style={{ color: 'var(--emerald)', fontSize: '0.95rem', fontWeight: 800 }}>
                RBI Zero Liability Protection
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              If unauthorized electronic transactions are reported within 3 days, customer liability is limited or zero under RBI circular DBR.No.Leg.BC.78/09.07.005/2017-18. Timely formal notice is essential to preserve this right.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
