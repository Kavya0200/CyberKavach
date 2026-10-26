import React, { useState } from 'react';
import {
  PhoneCall,
  Building2,
  Printer,
  Copy,
  Check,
  ShieldAlert,
  ArrowLeft,
  Scale,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import GoldenHourTimer from './GoldenHourTimer';
import HelplineScriptModal from './HelplineScriptModal';
import BankNoticeModal from './BankNoticeModal';
import NextStepsGuide from './NextStepsGuide';

export default function DossierView({ report, onBack, onOpenFIR }) {
  const [showHelplineModal, setShowHelplineModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  if (!report) return null;

  const { victim, financialDetails, incident, legalSections = [], triage, complaintId, status, createdAt } = report;
  const amountStr = Number(incident?.amountLost || 0).toLocaleString('en-IN');
  const dateFormatted = createdAt
    ? new Date(createdAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Just now';

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'utr') {
      setCopiedUtr(true);
      setTimeout(() => setCopiedUtr(false), 2000);
    } else if (type === 'vpa') {
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    } else if (type === 'notice') {
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2000);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      {/* Top Navigation & Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <button className="btn-action-secondary" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }} onClick={onBack}>
          <ArrowLeft size={14} />
          <span>New Report</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Case ID:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
            {complaintId}
          </span>
          <span className={`status-badge ${status}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
            {status?.replace('_', ' ') || 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Emergency Golden-Hour Response Bar */}
      <GoldenHourTimer initialMinutes={triage?.goldenHourRemainingMinutes || 105} isFrozen={status === 'FUNDS_FROZEN'} />

      {/* Card 1: Key Financial Facts */}
      <div className="form-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 10, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldAlert size={16} color="#DC2626" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
              Disputed Financial Details
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dateFormatted}</span>
        </div>

        <div className="data-table-grid">
          <div className="data-cell" style={{ borderLeft: '3px solid #DC2626' }}>
            <div className="lbl">Disputed Loss</div>
            <div className="val" style={{ color: '#DC2626', fontSize: '1.25rem', fontWeight: 800 }}>
              ₹{amountStr}
            </div>
          </div>

          <div className="data-cell" style={{ borderLeft: '3px solid #1E3A5F' }}>
            <div className="lbl">12-Digit Reference UTR</div>
            <div className="val">
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{financialDetails?.utrNumber || 'PENDING'}</span>
              {financialDetails?.utrNumber && (
                <button className="btn-copy" onClick={() => copyToClipboard(financialDetails.utrNumber, 'utr')} title="Copy UTR">
                  {copiedUtr ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  <span>{copiedUtr ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="data-cell">
            <div className="lbl">Suspect UPI / Account</div>
            <div className="val">
              <span style={{ fontSize: '0.85rem' }}>{financialDetails?.suspectVpa || 'N/A'}</span>
              {financialDetails?.suspectVpa && (
                <button className="btn-copy" onClick={() => copyToClipboard(financialDetails.suspectVpa, 'vpa')} title="Copy UPI">
                  {copiedVpa ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="data-cell">
            <div className="lbl">Suspect Bank</div>
            <div className="val" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              {financialDetails?.suspectBank || 'Beneficiary Bank'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Forensic Intelligence & Case Insights Card */}
      {triage?.aiInsights && triage.aiInsights.length > 0 && (
        <div className="form-card" style={{ marginBottom: 16, borderLeft: '4px solid #7C3AED' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: '#F5F3FF', color: '#7C3AED', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} />
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#4C1D95', margin: 0 }}>
                AI Forensic Analysis & Case Intelligence
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#F5F3FF', color: '#7C3AED', padding: '2px 8px', borderRadius: 4, fontWeight: 700, border: '1px solid #DDD6FE' }}>
              {triage.aiEngineUsed || 'Google Gemini AI'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {triage.aiInsights.map((insight, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <div style={{ color: '#7C3AED', marginTop: 3, flexShrink: 0 }}>
                  <CheckCircle2 size={14} />
                </div>
                <div>{insight}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card 2: Immediate Recovery Steps */}
      <div className="form-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>
          Immediate Action Steps
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14 }}>
          Follow these 3 steps in order to prevent fraudsters from cashing out:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Action Step 1 */}
          <div className="action-step-card" style={{ borderLeft: '4px solid #DC2626' }}>
            <div className="action-step-header">
              <div className="action-step-title">
                <span className="step-num-badge red">1</span>
                <div>
                  <strong>Call Cyber Helpline 1930</strong>
                  <span className="step-urgency-tag">Immediate (0–15 Mins)</span>
                </div>
              </div>
            </div>
            <p className="action-step-desc">
              Dial 1930 and state your 12-digit UTR (<strong>{financialDetails?.utrNumber || 'N/A'}</strong>). The operator issues an instant freeze alert to {financialDetails?.suspectBank || 'the receiving bank'}.
            </p>
            <div className="action-step-btns">
              <a href="tel:1930" className="btn-action-primary" style={{ background: '#DC2626', textDecoration: 'none', textAlign: 'center' }}>
                <PhoneCall size={14} />
                <span>Call 1930 Now</span>
              </a>
              <button className="btn-action-secondary" onClick={() => setShowHelplineModal(true)}>
                What to Say to Operator
              </button>
            </div>
          </div>

          {/* Action Step 2 */}
          <div className="action-step-card" style={{ borderLeft: '4px solid #1E3A5F' }}>
            <div className="action-step-header">
              <div className="action-step-title">
                <span className="step-num-badge navy">2</span>
                <div>
                  <strong>Send Bank Debit-Freeze Notice</strong>
                  <span className="step-urgency-tag">Within 30 Mins</span>
                </div>
              </div>
            </div>
            <p className="action-step-desc">
              Serve a legal statutory freeze requisition to the Nodal Officer of {financialDetails?.suspectBank || 'the beneficiary bank'} citing RBI Master Directions.
            </p>
            <div className="action-step-btns">
              <button
                className="btn-action-secondary"
                onClick={() => copyToClipboard(triage?.bankFreezeDraft || '', 'notice')}
              >
                {copiedNotice ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                <span>{copiedNotice ? 'Notice Copied!' : 'Copy Bank Notice'}</span>
              </button>
              <button className="btn-action-secondary" onClick={() => setShowBankModal(true)}>
                <Building2 size={14} />
                <span>View Full Notice</span>
              </button>
            </div>
          </div>

          {/* Action Step 3 */}
          <div className="action-step-card" style={{ borderLeft: '4px solid #059669' }}>
            <div className="action-step-header">
              <div className="action-step-title">
                <span className="step-num-badge green">3</span>
                <div>
                  <strong>File Formal Police FIR Complaint</strong>
                  <span className="step-urgency-tag">Within 24 Hours</span>
                </div>
              </div>
            </div>
            <p className="action-step-desc">
              Take the court-ready police complaint dossier to your local Cyber Police Station or submit it online at cybercrime.gov.in.
            </p>
            <div className="action-step-btns">
              <button className="btn-action-primary" style={{ background: '#059669' }} onClick={onOpenFIR}>
                <Printer size={14} />
                <span>View & Print Police FIR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Action Plan & Next Steps Checklist */}
      {triage?.nextSteps && triage.nextSteps.length > 0 && (
        <NextStepsGuide
          steps={triage.nextSteps}
          fraudCategory={incident?.fraudCategory}
          onOpen1930={() => setShowHelplineModal(true)}
          onOpenBank={() => setShowBankModal(true)}
          onOpenFIR={onOpenFIR}
        />
      )}

      {/* Card 3: Modus Operandi & Complainant Record */}
      <div className="form-card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
          Incident Summary & Legal Classification
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
          {incident?.summary || incident?.narrative}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {legalSections?.map((sec, i) => (
            <span key={i} className="meta-pill blue" style={{ fontSize: '0.72rem' }}>
              <Scale size={11} /> {sec.code} ({sec.act})
            </span>
          ))}
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Complainant:</strong> {victim?.name || 'Citizen'} • {victim?.phone} • {victim?.email}
        </div>
      </div>

      {/* Modals */}
      {showHelplineModal && (
        <HelplineScriptModal
          scriptText={triage?.call1930Script}
          complaintId={complaintId}
          onClose={() => setShowHelplineModal(false)}
        />
      )}

      {showBankModal && (
        <BankNoticeModal
          noticeText={triage?.bankFreezeDraft}
          suspectBank={financialDetails?.suspectBank}
          complaintId={complaintId}
          amount={incident?.amountLost}
          utr={financialDetails?.utrNumber}
          onClose={() => setShowBankModal(false)}
        />
      )}
    </div>
  );
}
