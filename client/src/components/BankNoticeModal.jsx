import React, { useState } from 'react';
import { X, Copy, Check, Mail, Building2 } from 'lucide-react';

export default function BankNoticeModal({ noticeText, suspectBank, complaintId, amount, utr, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(noticeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const subject = encodeURIComponent(`URGENT: STATUTORY DEBIT-FREEZE DEMAND - CYBER FRAUD (UTR: ${utr || 'UNKNOWN'})`);
  const body = encodeURIComponent(noticeText);
  const mailtoLink = `mailto:nodal.officer@bank.in?subject=${subject}&body=${body}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 740 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--primary)', color: '#fff', width: 36, height: 36, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>Statutory Bank Nodal Freeze Notice</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Under RBI Limiting Liability Directives & IT Act §66D</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 14, fontSize: '0.82rem', color: '#78350F' }}>
          ⚖️ <strong>Legal Mandate:</strong> Send this notice immediately to the Nodal Grievance Officer and Fraud Monitoring Cell of <strong>{suspectBank || 'the beneficiary bank'}</strong>. Banks are legally required to place an administrative hold upon receiving formal disputed UTR notice.
        </div>

        <pre className="modal-script-container" style={{ maxHeight: 320, overflowY: 'auto' }}>
          {noticeText}
        </pre>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-action-secondary" onClick={onClose} style={{ width: 'auto' }}>
            Close
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={mailtoLink} target="_blank" rel="noreferrer" className="btn-action-secondary" style={{ width: 'auto', background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E3A5F' }}>
              <Mail size={15} />
              Open in Email App
            </a>
            <button className="btn-action-primary" onClick={handleCopy} style={{ width: 'auto' }}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied Full Legal Notice!' : 'Copy Notice Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
