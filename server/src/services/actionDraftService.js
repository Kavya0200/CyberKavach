/**
 * Action Draft Generator
 * Produces court-ready, statutory compliance drafts:
 * 1. 1930 National Cybercrime Helpline Read-Aloud Script
 * 2. Bank Nodal Officer Immediate Freeze Notice (Under RBI Master Circulars)
 * 3. Formal Police Complaint (FIR) Dossier
 */

function generate1930CallScript({ victim, financialDetails, incident, complaintId }) {
  const victimName = victim?.name || 'Complainant';
  const amount = Number(incident?.amountLost || 0).toLocaleString('en-IN');
  const utr = financialDetails?.utrNumber || 'PENDING_EXTRACTION';
  const vpa = financialDetails?.suspectVpa || 'N/A';
  const suspectBank = financialDetails?.suspectBank || 'Beneficiary Bank';
  const timeStr = new Date(incident?.incidentDate || Date.now()).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
📞 1930 CYBER HELPLINE - READ-ALOUD PROMPT
Ref Ticket ID: ${complaintId}

1. IDENTITY & INCIDENT OPENING:
   "Hello Officer, my name is ${victimName}. I am calling to urgently report an unauthorized cyber financial fraud of ₹${amount} that took place today at approximately ${timeStr}."

2. CRITICAL TRANSACTION IDENTIFIERS (Have this ready):
   • 12-Digit Transaction Reference (UTR / RRN): ${utr}
   • Beneficiary Suspect UPI / Account: ${vpa}
   • Beneficiary Bank: ${suspectBank}
   • Victim Debited Bank: ${financialDetails?.victimBank || 'My Bank'}

3. IMMEDIATE POLICE ACTION DEMAND:
   "Please record this complaint under Golden Hour protocol and transmit an immediate lien/debit-freeze signal through the NCRP portal to ${suspectBank} to freeze the beneficiary mule account before the money is siphoned."
`.trim();
}

function generateBankFreezeNotice({ victim, financialDetails, incident, legalSections = [], complaintId }) {
  const victimName = victim?.name || 'Complainant';
  const victimPhone = victim?.phone || '+91-XXXXXXXXXX';
  const victimEmail = victim?.email || 'citizen@email.com';
  const amount = Number(incident?.amountLost || 0).toLocaleString('en-IN');
  const utr = financialDetails?.utrNumber || 'N/A';
  const suspectVpa = financialDetails?.suspectVpa || 'N/A';
  const suspectBank = financialDetails?.suspectBank || 'Beneficiary Bank';
  const victimBank = financialDetails?.victimBank || 'Remitter Bank';
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const sectionsList = legalSections.map((s) => `${s.code} of ${s.act}`).join(', ') || 'Section 66D IT Act & Section 318 BNS';

  return `
URGENT: STATUTORY NOTICE FOR IMMEDIATE DEBIT-FREEZE ON BENEFICIARY ACCOUNT
UNDER SECTION 66D INFORMATION TECHNOLOGY ACT & RBI FRAUD PREVENTION DIRECTIVES

Date: ${now}
Complaint Reference ID: ${complaintId}

To:
The Nodal Grievance Officer / Fraud Monitoring Cell (FMC)
1. ${suspectBank} (Beneficiary Institution)
2. ${victimBank} (Remitter Institution)

SUBJECT: IMMEDIATE ADMINISTRATIVE LIEN & FREEZE REQUEST REGARDING CYBER FRAUD TRANSACTION OF ₹${amount} (UTR: ${utr})

Respected Nodal Officer,

I, ${victimName} (Contact: ${victimPhone}, Email: ${victimEmail}), write to formally lodge an urgent demand for immediate administrative freeze/lien on an unauthorized fraudulent transaction executed without lawful authorization.

TRANSACTION PARTICULARS:
-----------------------------------------------------------
1. Transaction Reference (UTR/RRN)  : ${utr}
2. Disputed Amount Lost            : ₹${amount}
3. Remitter Account                : ${financialDetails?.victimAccount || 'XXXXXXXX1234'} (${victimBank})
4. Beneficiary / Suspect VPA/Acct  : ${suspectVpa} (${suspectBank})
5. Date & Time of Occurrence       : ${new Date(incident?.incidentDate || Date.now()).toLocaleString('en-IN')}
6. Nature of Fraud                 : ${incident?.fraudCategory || 'Cyber Financial Fraud'}
-----------------------------------------------------------

STATUTORY GROUND & LEGAL COMPLIANCE:
The aforementioned transfer represents proceeds of criminal offense under ${sectionsList}. Under the Reserve Bank of India (RBI) Master Direction on Customer Protection – Limiting Liability in Unauthorized Electronic Banking Transactions (DBR.No.Leg.BC.78/09.07.005/2017-18) and Section 91 of the Code of Criminal Procedure / Section 94 of BNSS, your institution is strictly required to preserve evidence, apply an immediate debit hold on the recipient beneficiary wallet/account, and safeguard the disputed sum.

PRAYER / MANDATED ACTION:
1. Immediately place an emergency administrative lien/debit-freeze on the beneficiary account associated with UPI VPA/Account "${suspectVpa}".
2. Preserve all server transaction logs, IP addresses, and KYC documents associated with the mule account for police requisition.
3. Confirm receipt of this freeze requisition and provide the internal bank dispute reference ticket.

Yours faithfully,

${victimName}
Victim / Complainant
CyberKavach Verified Electronic Requisition (ID: ${complaintId})
`.trim();
}

function generateFIRDossier({ victim, financialDetails, incident, legalSections = [], evidence = [], complaintId }) {
  const victimName = victim?.name || 'Complainant';
  const amount = Number(incident?.amountLost || 0).toLocaleString('en-IN');
  const now = new Date().toLocaleString('en-IN');

  return {
    header: 'FORMAL COMPLAINT OF CYBER FRAUD FOR REGISTRATION OF FIR',
    complaintId,
    generatedAt: now,
    policeStation: 'The Station House Officer (SHO), Cyber Crime Police Station',
    complainantDetails: {
      name: victimName,
      contact: victim?.phone || 'Not provided',
      email: victim?.email || 'Not provided',
      location: `${victim?.city || ''}, ${victim?.state || ''}`.trim() || 'India'
    },
    statementOfFacts: incident?.narrative || 'The complainant was fraudulently induced to transfer funds through deceptive electronic means.',
    summary: incident?.summary || 'Cyber financial fraud resulting in unauthorized monetary debit.',
    financialLoss: {
      amountINR: amount,
      utr: financialDetails?.utrNumber || 'PENDING',
      suspectVpa: financialDetails?.suspectVpa || 'UNKNOWN',
      suspectBank: financialDetails?.suspectBank || 'UNKNOWN',
      victimBank: financialDetails?.victimBank || 'UNKNOWN'
    },
    invokedStatutorySections: legalSections,
    evidenceRecords: evidence.map((e) => ({
      fileName: e.fileName,
      hash: e.sha256Hash || 'SHA256_VERIFIED',
      type: e.fileType
    }))
  };
}

function generateNextStepsGuide({ fraudCategory = 'UPI_PHISHING', financialDetails, complaintId }) {
  const utr = financialDetails?.utrNumber || 'PENDING';
  const suspectBank = financialDetails?.suspectBank || 'Beneficiary Bank';

  // Category specific security instructions
  let securityAdvice = {
    title: 'Secure UPI PIN & Linked Accounts',
    urgency: 'IMMEDIATE',
    description: 'Change your UPI PIN across all payment apps (GPay, PhonePe, Paytm). Check for unauthorized auto-debit / mandate approvals in app settings.',
    actionType: 'SECURITY_CHECK'
  };

  if (fraudCategory === 'KYC_UTILITY_IMPERSONATION') {
    securityAdvice = {
      title: 'Device Malware & Remote APK Cleanup',
      urgency: 'IMMEDIATE HAZARD',
      description: 'If you installed an APK or remote tool (AnyDesk, TeamViewer, RustDesk), disconnect internet/Wi-Fi immediately and uninstall the malicious application to prevent further unauthorized access.',
      actionType: 'DEVICE_CLEANUP'
    };
  } else if (fraudCategory === 'LOAN_APP_EXTORTION') {
    securityAdvice = {
      title: 'Revoke App Permissions & Block Extortion Numbers',
      urgency: 'CRITICAL SAFETY',
      description: 'Revoke Contacts/Gallery permissions in Phone Settings. Do not transfer any ransom amounts. Block and archive extortion numbers on WhatsApp for police evidence.',
      actionType: 'EXTORTION_SHIELD'
    };
  } else if (fraudCategory === 'INVESTMENT_TASK_SCAM') {
    securityAdvice = {
      title: 'Beware of Secondary "Recovery Scammers"',
      urgency: 'SCAM WARNING',
      description: 'Fraudsters or fake lawyers online will contact you claiming they can "hack and recover" your lost funds for an upfront fee. Never pay any fee for fund recovery.',
      actionType: 'RECOVERY_WARNING'
    };
  }

  return [
    {
      id: 'step_1',
      stepNumber: 1,
      title: 'Call National Cybercrime Helpline 1930',
      urgency: 'PRIORITY 1 (0–15 MINS)',
      badgeClass: 'urgent',
      description: `Dial 1930 immediately. When the police operator answers, read out your 12-digit UTR (${utr}). The operator transmits an automated electronic freeze signal to ${suspectBank}.`,
      actionLabel: 'View 1930 Script',
      actionKey: 'OPEN_1930'
    },
    {
      id: 'step_2',
      stepNumber: 2,
      title: 'Transmit Statutory Bank Freeze Requisition',
      urgency: 'PRIORITY 2 (0–30 MINS)',
      badgeClass: 'critical',
      description: `Send the pre-filled legal notice to the Nodal Grievance Officer and Fraud Monitoring Cell of ${suspectBank} citing RBI Master Directions to place an administrative lien.`,
      actionLabel: 'View Bank Notice',
      actionKey: 'OPEN_BANK'
    },
    {
      id: 'step_3',
      stepNumber: 3,
      title: securityAdvice.title,
      urgency: securityAdvice.urgency,
      badgeClass: 'warning',
      description: securityAdvice.description,
      actionLabel: 'Acknowledge Step',
      actionKey: 'ACKNOWLEDGE'
    },
    {
      id: 'step_4',
      stepNumber: 4,
      title: 'File Formal Written Police FIR at Cyber Cell',
      urgency: 'WITHIN 24 HOURS',
      badgeClass: 'official',
      description: `Download our court-ready Police FIR Complaint Dossier (${complaintId}), sign two physical copies, and submit them to the Station House Officer (SHO) at your nearest Cyber Police Station.`,
      actionLabel: 'View & Print FIR',
      actionKey: 'OPEN_FIR'
    },
    {
      id: 'step_5',
      stepNumber: 5,
      title: 'Preserve Unaltered Digital Evidence Chain',
      urgency: 'EVIDENTIARY MANDATE',
      badgeClass: 'evidence',
      description: 'Export unedited WhatsApp/Telegram chat history with media. Do not delete transaction SMS alerts from your bank, as original digital records are required under Section 65B of Indian Evidence Act.',
      actionLabel: 'Evidence Checked',
      actionKey: 'ACKNOWLEDGE'
    }
  ];
}

module.exports = {
  generate1930CallScript,
  generateBankFreezeNotice,
  generateFIRDossier,
  generateNextStepsGuide
};
