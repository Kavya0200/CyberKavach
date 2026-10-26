import React from 'react';
import { Printer, ArrowLeft, Shield } from 'lucide-react';

export default function FIRPrintView({ report, onBack }) {
  if (!report) return null;

  const { victim, financialDetails, incident, legalSections = [], evidence = [], complaintId, createdAt } = report;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : 'Current Date';
  const amountStr = Number(incident?.amountLost || 0).toLocaleString('en-IN');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', paddingBottom: 60 }}>
      {/* Top action bar (hidden during print) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button className="btn-action-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Triage Dossier
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary-action" onClick={handlePrint} style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
            <Printer size={16} />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Official Court Document Sheet */}
      <div
        className="printable-fir-sheet"
        style={{
          background: '#FFFFFF',
          color: '#111827',
          padding: '40px 48px',
          borderRadius: 8,
          boxShadow: 'var(--shadow-lg)',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1.6
        }}
      >
        {/* Header Insignia */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #111827', paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
            <Shield size={32} color="#1E3A8A" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1E3A8A' }}>
            NATIONAL CYBER CRIME REPORTING PORTAL (NCRP)
          </h2>
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#374151' }}>
            FORMAL COMPLAINT UNDER SECTION 154 / 156 CR.P.C. (SECTION 173 / 175 B.N.S.S.)
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.82rem', fontFamily: 'sans-serif' }}>
            <span><strong>Dossier Tracking ID:</strong> {complaintId}</span>
            <span><strong>Date of Generation:</strong> {formattedDate}</span>
          </div>
        </div>

        {/* Addressee */}
        <div style={{ marginBottom: 20, fontSize: '0.95rem' }}>
          <p><strong>TO:</strong></p>
          <p>The Station House Officer (SHO) / Superintendent of Police,</p>
          <p>Cyber Crime Police Station,</p>
          <p>{victim?.city || 'New Delhi'}, {victim?.state || 'Delhi'}, India.</p>
        </div>

        {/* Subject */}
        <div style={{ background: '#F3F4F6', borderLeft: '4px solid #1E3A8A', padding: '10px 14px', marginBottom: 20, fontSize: '0.95rem' }}>
          <strong>SUBJECT:</strong> FORMAL CRIMINAL COMPLAINT REGARDING UNLAWFUL FINANCIAL THEFT OF ₹{amountStr} THROUGH ELECTRONIC CHEATING AND IMPERSONATION (UTR: {financialDetails?.utrNumber || 'N/A'}).
        </div>

        {/* Complainant Particulars */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: 4, marginBottom: 8, color: '#1E3A8A' }}>
            1. PARTICULARS OF THE COMPLAINANT
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <tbody>
              <tr>
                <td style={{ width: '30%', padding: '4px 0' }}><strong>Full Name:</strong></td>
                <td>{victim?.name || 'Anonymous Citizen'}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0' }}><strong>Contact Mobile:</strong></td>
                <td>{victim?.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0' }}><strong>Email Address:</strong></td>
                <td>{victim?.email || 'Not provided'}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0' }}><strong>Resident City / State:</strong></td>
                <td>{victim?.city || ''}, {victim?.state || ''}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0' }}><strong>Authentication Mode:</strong></td>
                <td>Verified Portal Account ({victim?.email || 'Registered User'})</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Details Table */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: 4, marginBottom: 8, color: '#1E3A8A' }}>
            2. DISPUTED FINANCIAL TRANSACTION RECORD
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #D1D5DB', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                <th style={{ border: '1px solid #D1D5DB', padding: '6px 10px', textAlign: 'left' }}>Parameter</th>
                <th style={{ border: '1px solid #D1D5DB', padding: '6px 10px', textAlign: 'left' }}>Record Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px' }}><strong>Disputed Amount Lost</strong></td>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px', color: '#B91C1C', fontWeight: 'bold' }}>₹{amountStr} (INR)</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px' }}><strong>12-Digit Reference UTR / RRN</strong></td>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px', fontFamily: 'monospace', fontWeight: 'bold' }}>{financialDetails?.utrNumber || 'PENDING'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px' }}><strong>Beneficiary / Suspect UPI VPA</strong></td>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px' }}>{financialDetails?.suspectVpa || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px' }}><strong>Beneficiary Receiving Bank</strong></td>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px' }}>{financialDetails?.suspectBank || 'Beneficiary Institution'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px' }}><strong>Remitter Account Bank</strong></td>
                <td style={{ border: '1px solid #D1D5DB', padding: '6px 10px' }}>{financialDetails?.victimBank || 'Complainant Bank'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Narrative & Modus Operandi */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: 4, marginBottom: 8, color: '#1E3A8A' }}>
            3. STATEMENT OF FACTS & MODUS OPERANDI
          </h4>
          <p style={{ textAlign: 'justify', fontSize: '0.9rem', marginBottom: 10 }}>
            {incident?.narrative || 'The complainant was fraudulently induced to transfer funds through electronic deception.'}
          </p>
        </div>

        {/* Invoked Statutory Sections */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: 4, marginBottom: 8, color: '#1E3A8A' }}>
            4. INVOCATION OF STATUTORY PENAL PROVISIONS
          </h4>
          <p style={{ fontSize: '0.85rem', marginBottom: 8 }}>
            Based on the electronic evidence and modus operandi, the accused individual(s) and beneficiary account holders have committed cognizable offenses under:
          </p>
          <ul style={{ paddingLeft: 20, fontSize: '0.85rem' }}>
            {legalSections.map((sec, idx) => (
              <li key={idx} style={{ marginBottom: 6 }}>
                <strong>{sec.code} of {sec.act}:</strong> {sec.title}. ({sec.description})
              </li>
            ))}
          </ul>
        </div>

        {/* Evidence Hash Table */}
        {evidence.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: 4, marginBottom: 8, color: '#1E3A8A' }}>
              5. PRESERVED ELECTRONIC EVIDENCE (SHA-256 INTEGRITY CHAIN)
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #D1D5DB', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={{ border: '1px solid #D1D5DB', padding: '4px 8px', textAlign: 'left' }}>Item</th>
                  <th style={{ border: '1px solid #D1D5DB', padding: '4px 8px', textAlign: 'left' }}>File Name</th>
                  <th style={{ border: '1px solid #D1D5DB', padding: '4px 8px', textAlign: 'left' }}>Cryptographic SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((ev, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #D1D5DB', padding: '4px 8px' }}>Exh. #{i + 1}</td>
                    <td style={{ border: '1px solid #D1D5DB', padding: '4px 8px' }}>{ev.fileName}</td>
                    <td style={{ border: '1px solid #D1D5DB', padding: '4px 8px', fontFamily: 'monospace', fontSize: '0.72rem' }}>{ev.sha256Hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Prayer / Demands */}
        <div style={{ marginBottom: 24, fontSize: '0.9rem' }}>
          <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: 4, marginBottom: 8, color: '#1E3A8A' }}>
            6. PRAYER TO INVESTIGATING AUTHORITIES
          </h4>
          <ol style={{ paddingLeft: 20 }}>
            <li>Register a formal First Information Report (FIR) under the aforementioned sections.</li>
            <li>Issue Section 91 Cr.P.C. requisition to {financialDetails?.suspectBank || 'the beneficiary bank'} to freeze the suspect mule account and debit balance.</li>
            <li>Requisition CDR/IPDR records from the Telecom Service Providers to trace the cyber criminal syndicate.</li>
          </ol>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 20, borderTop: '1px solid #E5E7EB', fontSize: '0.88rem' }}>
          <div>
            <p>_________________________________</p>
            <p><strong>Verified by CyberKavach Engine</strong></p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Hash Verified • Electronic Certification</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p>_________________________________</p>
            <p><strong>Signature of Complainant</strong></p>
            <p>({victim?.name || 'Complainant'})</p>
          </div>
        </div>
      </div>
    </div>
  );
}
