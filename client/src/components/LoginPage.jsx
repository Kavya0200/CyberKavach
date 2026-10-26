import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Shield, ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function LoginPage({ onLoginSuccess, onNavigateHome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoFill = () => {
    setIsLogin(true);
    setError('');
    setEmail('citizen@example.com');
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
    const payload = isLogin
      ? { email, password }
      : { name, email, password, role: 'citizen', phone, city };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('cyberkavach_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Authentication failed. Please check your email and password.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Connection to auth server failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 440, margin: '24px auto', padding: '0 16px' }}>
      {/* Top Back Navigation */}
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="btn-action-secondary"
          style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }}
          onClick={onNavigateHome}
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Citizen Login Card */}
      <div className="form-card" style={{ padding: '28px 24px' }}>
        {/* Emblem & Title */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            <Shield size={24} strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            {isLogin ? 'Citizen Sign In' : 'Create Citizen Account'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {isLogin
              ? 'Sign in to file cybercrime complaints and track recovery status.'
              : 'Register your email to file and manage your fraud reports.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: 14 }}>
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

              <div className="form-grid-2" style={{ marginBottom: 14 }}>
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
                placeholder="citizen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-submit-action"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <span>{isLogin ? 'Sign In as Citizen' : 'Create Citizen Account'}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {isLogin ? (
            <>
              New complainant?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register Here
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </>
          )}
        </div>

        {/* Academic Evaluator Credentials Box */}
        <div
          style={{
            marginTop: 24,
            padding: '14px 16px',
            background: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-medium)',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🎓 Academic Evaluator / Demo Credentials</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8, fontSize: '0.75rem' }}>
            Pre-configured accounts stored in MongoDB Atlas for quick project evaluation:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--border-light)' }}>
              <div>
                <strong>Citizen Account:</strong> <code style={{ color: 'var(--primary)' }}>evaluator@cyberkavach.gov.in</code> (Pass: <code>evaluator123</code>)
              </div>
              <button
                type="button"
                style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                onClick={() => {
                  setIsLogin(true);
                  setEmail('evaluator@cyberkavach.gov.in');
                  setPassword('evaluator123');
                  setError('');
                }}
              >
                Auto-Fill
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--border-light)' }}>
              <div>
                <strong>Police Officer Desk:</strong> <code style={{ color: 'var(--primary)' }}>officer@cyberkavach.gov.in</code> (Pass: <code>police123</code>)
              </div>
              <button
                type="button"
                style={{ fontSize: '0.72rem', padding: '3px 8px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                onClick={() => {
                  setIsLogin(true);
                  setEmail('officer@cyberkavach.gov.in');
                  setPassword('police123');
                  setError('');
                }}
              >
                Auto-Fill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
