import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  PhoneCall,
  Building2,
  ShieldCheck,
  FileText,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function NextStepsGuide({
  steps = [],
  fraudCategory = 'UPI_PHISHING',
  onOpen1930,
  onOpenBank,
  onOpenFIR
}) {
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (id) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalSteps = steps.length || 5;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="form-card" style={{ padding: '28px 32px', marginBottom: 24, borderLeft: '5px solid #1E3A5F' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 16, marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="meta-pill blue" style={{ fontSize: '0.7rem' }}>
              Statutory Action Protocol
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Follow in Chronological Order
            </span>
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>
            Mandatory Action Plan & Next Steps
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Execute these 5 critical steps to lock scammer accounts and maximize money recovery under NCRP guidelines.
          </p>
        </div>

        {/* Progress Badge */}
        <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '10px 16px', borderRadius: 'var(--radius-md)', textAlign: 'right', minWidth: 200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            <span>Action Checklist</span>
            <span style={{ color: completedCount === totalSteps ? '#059669' : 'var(--primary)' }}>
              {completedCount} of {totalSteps} Done ({progressPercent}%)
            </span>
          </div>
          <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: completedCount === totalSteps ? '#059669' : '#1E3A5F',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Category-Specific Warning Box */}
      {fraudCategory === 'KYC_UTILITY_IMPERSONATION' && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertTriangle size={20} color="#DC2626" style={{ shrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#991B1B' }}>
              CRITICAL: Disconnect Internet & Quarantine Your Device
            </div>
            <div style={{ fontSize: '0.82rem', color: '#B91C1C', marginTop: 2 }}>
              If you downloaded an APK or screen-sharing application (AnyDesk, TeamViewer, RustDesk), turn on <strong>Airplane Mode immediately</strong> and uninstall the app from Android Settings → Apps to prevent ongoing background debits.
            </div>
          </div>
        </div>
      )}

      {fraudCategory === 'LOAN_APP_EXTORTION' && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertTriangle size={20} color="#DC2626" style={{ shrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#991B1B' }}>
              CRITICAL: Do Not Pay Ransom Demands
            </div>
            <div style={{ fontSize: '0.82rem', color: '#B91C1C', marginTop: 2 }}>
              Loan app extortionists always demand more money once you pay. Immediately revoke contact/photo permissions for the loan app in Phone Settings, block the calling numbers, and do not delete WhatsApp threats (they are needed as evidence).
            </div>
          </div>
        </div>
      )}

      {fraudCategory === 'INVESTMENT_TASK_SCAM' && (
        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertTriangle size={20} color="#D97706" style={{ shrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#78350F' }}>
              ADVISORY: Beware of Secondary "Fund Recovery" Scams
            </div>
            <div style={{ fontSize: '0.82rem', color: '#92400E', marginTop: 2 }}>
              Telegram scammers frequently refer victims to fake "lawyers" or "ethical hackers" claiming they can recover your money for an advance fee. Only cyber police and bank nodal officers have the legal authority to freeze and restore funds.
            </div>
          </div>
        </div>
      )}

      {/* The 5 Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((step) => {
          const isDone = !!completedSteps[step.id];

          return (
            <div
              key={step.id}
              style={{
                background: isDone ? '#F0FDF4' : '#FFFFFF',
                border: isDone ? '1px solid #BBF7D0' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Step Number Circle */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: isDone ? '#059669' : '#1E3A5F',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}
              >
                {isDone ? <CheckCircle2 size={18} /> : step.stepNumber}
              </div>

              {/* Step Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: isDone ? '#065F46' : 'var(--text-primary)' }}>
                    {step.title}
                  </h4>
                  <span
                    className="meta-pill"
                    style={{
                      fontSize: '0.68rem',
                      background: step.badgeClass === 'urgent' ? '#FEF2F2' : step.badgeClass === 'critical' ? '#EFF6FF' : '#F1F5F9',
                      color: step.badgeClass === 'urgent' ? '#DC2626' : step.badgeClass === 'critical' ? '#1E3A5F' : '#475569',
                      border: '1px solid currentColor'
                    }}
                  >
                    {step.urgency}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: isDone ? '#047857' : 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
                  {step.description}
                </p>

                {/* Actions Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {step.actionKey === 'OPEN_1930' && (
                    <button className="btn-action-primary" style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem', background: '#DC2626' }} onClick={onOpen1930}>
                      <PhoneCall size={13} />
                      Open 1930 Call Script
                    </button>
                  )}

                  {step.actionKey === 'OPEN_BANK' && (
                    <button className="btn-action-secondary" style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem' }} onClick={onOpenBank}>
                      <Building2 size={13} />
                      Generate Bank Freeze Notice
                    </button>
                  )}

                  {step.actionKey === 'OPEN_FIR' && (
                    <button className="btn-action-primary" style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem', background: '#059669' }} onClick={onOpenFIR}>
                      <FileText size={13} />
                      View & Print Police FIR
                    </button>
                  )}

                  {/* Checkbox */}
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: isDone ? '#059669' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      marginLeft: 'auto'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleStep(step.id)}
                      style={{ width: 16, height: 16, accentColor: '#059669', cursor: 'pointer' }}
                    />
                    <span>{isDone ? 'Action Completed' : 'Mark Completed'}</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
