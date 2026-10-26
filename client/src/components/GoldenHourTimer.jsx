import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function GoldenHourTimer({ initialMinutes = 105, isFrozen = false }) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);

  useEffect(() => {
    if (isFrozen || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isFrozen, secondsRemaining]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const pad = (n) => String(n).padStart(2, '0');

  if (isFrozen) {
    return (
      <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#059669', color: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#065F46' }}>
              ADMINISTRATIVE LIEN ACTIVE — BENEFICIARY ACCOUNT FROZEN
            </div>
            <div style={{ fontSize: '0.78rem', color: '#047857' }}>
              Bank Nodal Officer placed debit freeze on the recipient account within the Golden-Hour response window.
            </div>
          </div>
        </div>
        <span className="status-badge FUNDS_FROZEN">LIEN PLACED</span>
      </div>
    );
  }

  return (
    <div className="golden-hour-alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ background: '#DC2626', color: '#fff', width: 44, height: 44, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={24} />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            CRITICAL GOLDEN-HOUR RESPONSE WINDOW
          </div>
          <div className="timer-digits-box">
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#991B1B', fontSize: '0.82rem', fontWeight: 800, marginBottom: 2, justifyContent: 'flex-end' }}>
          <AlertTriangle size={14} />
          Immediate Action Required
        </div>
        <p style={{ fontSize: '0.75rem', color: '#7F1D1D', lineHeight: 1.4 }}>
          Indian cyber police (1930) and partner banks can freeze the scammer's mule account before cash is withdrawn at an ATM if reported within 2 hours.
        </p>
      </div>
    </div>
  );
}
