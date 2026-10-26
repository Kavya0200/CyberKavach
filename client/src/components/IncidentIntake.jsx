import React, { useState, useEffect } from 'react';
import {
  Upload,
  User,
  X,
  ShieldAlert,
  Lock
} from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function IncidentIntake({ onTriageSuccess, isLoading, setIsLoading, currentUser, onRequireAuth }) {
  const [narrative, setNarrative] = useState('');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState('Karnataka');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.city) setCity(currentUser.city);
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshotFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setScreenshotFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Authentication Required: Please sign in or register to file a formal cybercrime complaint.');
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (!narrative.trim()) {
      alert('Please describe the incident, including any transaction UTR, suspect UPI ID, or phone number if available.');
      return;
    }

    setIsLoading(true);
    setLoadingStep(1);

    const stepTimer = setInterval(() => {
      setLoadingStep((s) => (s < 3 ? s + 1 : s));
    }, 700);

    try {
      const formData = new FormData();
      formData.append('narrative', narrative);
      formData.append('name', name || currentUser?.name || 'Citizen Complainant');
      formData.append('phone', phone || currentUser?.phone || '');
      formData.append('email', email || currentUser?.email || '');
      formData.append('city', city || currentUser?.city || '');
      formData.append('state', state || 'Delhi');
      if (screenshotFile) {
        formData.append('screenshot', screenshotFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/triage`, {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      clearInterval(stepTimer);

      if (json.success) {
        onTriageSuccess(json.data);
      } else {
        alert(json.error || 'Triage processing failed. Please check inputs.');
      }
    } catch (err) {
      clearInterval(stepTimer);
      console.error('Submission error:', err);
      alert('Backend connection error. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      {/* Streamlined Simple Header */}
      <div className="simple-page-header">
        <h2 className="simple-page-title">
          Report Cyber Fraud & Freeze Accounts
        </h2>
        <p className="simple-page-subtitle">
          Enter what happened below. We extract the 12-digit UTR, generate a formal Bank Debit-Freeze Notice, and guide you through immediate recovery.
        </p>
      </div>

      {/* Main Intake Card */}
      <div className="form-card">
        {/* Authentication Notice if not logged in */}
        {!currentUser && (
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                background: '#1E3A5F',
                color: '#FFFFFF',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Lock size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
                  Citizen Login Required to File Complaint
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Under statutory cyber police rules, an authenticated citizen profile is required to register an FIR report.
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-action-primary"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              onClick={onRequireAuth}
            >
              Sign In / Register
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Narrative Input */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">
              1. What Happened?
              <span className="helper">(Describe the scam, money lost, or paste SMS / UPI details)</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Received a fake electricity bill SMS. Downloaded APK and ₹48,500 was debited to Yes Bank UPI powerdesk99@ybl with UTR 429810938471..."
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Compact Screenshot Upload */}
          <div style={{ marginBottom: 18 }}>
            <label className="form-label">
              2. Attach Screenshot / Receipt <span className="helper">(Optional)</span>
            </label>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
                padding: isDragOver ? '12px' : '0',
                border: isDragOver ? '2px dashed var(--primary)' : 'none',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s ease'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                id="receipt-file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btn-action-secondary"
                style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
                onClick={() => document.getElementById('receipt-file-input').click()}
              >
                <Upload size={15} />
                <span>{screenshotFile ? 'Change Screenshot' : 'Upload Receipt / Chat'}</span>
              </button>

              {previewUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <img src={previewUrl} alt="Preview" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 4 }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {screenshotFile?.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 2 }}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Complainant Identity Section */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} />
              Complainant Information (Mandatory for Police FIR Application)
            </div>

            <div className="form-grid-2">
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Complainant Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Rohan Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Registered Contact Mobile</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91-98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Resident City & State</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Bengaluru, Karnataka"
                  value={city ? `${city}, ${state}` : ''}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setCity(parts[0]?.trim() || '');
                    setState(parts[1]?.trim() || '');
                  }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Complainant Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submission Button */}
          {!currentUser ? (
            <button
              type="button"
              className="btn-submit-action"
              onClick={onRequireAuth}
              style={{ background: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Lock size={17} />
              <span>Sign In / Register to File Complaint</span>
            </button>
          ) : (
            <button type="submit" className="btn-submit-action" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span>
                    {loadingStep === 1 && 'Extracting 12-Digit UTR and Account Facts...'}
                    {loadingStep === 2 && 'Mapping Statutory Provisions under IT Act & BNS...'}
                    {loadingStep >= 3 && 'Generating Bank Freeze Notice & FIR Dossier...'}
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert size={18} />
                  <span>Triage Incident & Initiate Golden-Hour Response</span>
                </>
              )}
            </button>
          )}
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
