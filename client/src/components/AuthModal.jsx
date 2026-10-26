import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = (type) => {
    if (type === 'citizen') {
      setEmail('citizen@example.com');
      setPassword('password123');
    } else {
      setEmail('officer@cyberkavach.gov.in');
      setPassword('police123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
    const payload = isLogin
      ? { email, password }
      : { name, email, password, role, phone, city };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('cyberkavach_user', JSON.stringify(data.user));
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Connection to auth server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 14, marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {isLogin ? 'Sign In to Your Account' : 'Register New Account'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isLogin
                ? 'Access your filed complaints, track recovery status, and manage FIRs.'
                : 'Create an account to file complaints and track bank freeze notices.'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 1-Click Demo Logins */}
        <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 18 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
            Quick Demo 1-Click Fill:
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="preset-chip-btn"
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
              onClick={() => handleDemoLogin('citizen')}
            >
              👤 Citizen Demo
            </button>
            <button
              type="button"
              className="preset-chip-btn"
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
              onClick={() => handleDemoLogin('officer')}
            >
              👮 Cyber Officer Demo
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="e.g. Rohan Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginBottom: 12 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Mobile Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91-98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Account Type</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      value="citizen"
                      checked={role === 'citizen'}
                      onChange={() => setRole('citizen')}
                    />
                    Citizen Complainant
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      value="officer"
                      checked={role === 'officer'}
                      onChange={() => setRole('officer')}
                    />
                    Cyber Cell Officer
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label className="form-label" style={{ fontSize: '0.82rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-dim)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 18 }}>
            <label className="form-label" style={{ fontSize: '0.82rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-dim)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-action-primary" disabled={loading} style={{ width: '100%', padding: '11px 16px', fontSize: '0.92rem' }}>
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Sign In / Register */}
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Register Here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In Here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
