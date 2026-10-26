import React, { useState } from 'react';
import { X, Copy, Check, PhoneCall } from 'lucide-react';

export default function HelplineScriptModal({ scriptText, complaintId, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#DC2626', color: '#fff', width: 36, height: 36, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneCall size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>1930 National Helpline Script</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ticket ID: {complaintId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 14, fontSize: '0.82rem', color: '#1E3A5F' }}>
          💡 <strong>Instruction:</strong> Call <strong>1930</strong> now. When the police operator answers, read the highlighted lines below out loud. Operators need the 12-digit UTR immediately to trigger the bank freeze.
        </div>

        <pre className="modal-script-container">{scriptText}</pre>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button className="btn-action-secondary" onClick={onClose} style={{ flex: 1 }}>
            Close
          </button>
          <button className="btn-action-primary" onClick={handleCopy} style={{ flex: 2, background: '#DC2626' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied Prompt to Clipboard!' : 'Copy Script for 1930 Call'}
          </button>
        </div>
      </div>
    </div>
  );
}
