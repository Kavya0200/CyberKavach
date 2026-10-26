/**
 * Statutory Legal Penal Code Classifier
 * Maps cyber financial fraud incidents to relevant provisions under:
 * - Information Technology (IT) Act, 2000 (and 2008 amendments)
 * - Bharatiya Nyaya Sanhita (BNS), 2023 (replacing IPC)
 */

const STATUTORY_SECTIONS = {
  IT_ACT_66D: {
    code: 'Section 66D',
    act: 'Information Technology Act, 2000',
    title: 'Cheating by Personation using Computer Resource',
    description:
      'Whoever, by means of any communication device or computer resource, cheats by personation, shall be punished.',
    maxPenalty: 'Imprisonment up to 3 years and fine up to ₹1,00,000'
  },
  IT_ACT_66C: {
    code: 'Section 66C',
    act: 'Information Technology Act, 2000',
    title: 'Identity Theft & Unauthorized Credential Use',
    description:
      'Whoever fraudulently or dishonestly uses electronic signatures, passwords, or unique identification features of another person.',
    maxPenalty: 'Imprisonment up to 3 years and fine up to ₹1,00,000'
  },
  IT_ACT_43: {
    code: 'Section 43',
    act: 'Information Technology Act, 2000',
    title: 'Damage to Computer Systems & Unauthorized Data Extraction',
    description:
      'Accessing or downloading data without permission, introducing computer contaminants or malware (e.g. malicious APKs).',
    maxPenalty: 'Civil compensation to affected person up to ₹5,00,00,000'
  },
  BNS_318_4: {
    code: 'Section 318(4)',
    act: 'Bharatiya Nyaya Sanhita, 2023 (formerly IPC 420)',
    title: 'Cheating and Dishonestly Inducing Delivery of Property',
    description:
      'Deceiving any person and fraudulently inducing delivery of valuable property, money, or electronic funds.',
    maxPenalty: 'Rigorous imprisonment up to 7 years and fine'
  },
  BNS_319: {
    code: 'Section 319',
    act: 'Bharatiya Nyaya Sanhita, 2023 (formerly IPC 419)',
    title: 'Punishment for Cheating by Personation',
    description:
      'Pretending to be another real or fictitious person (e.g. posing as Bank Official, Electricity Board Agent, Police).',
    maxPenalty: 'Imprisonment up to 5 years and fine'
  },
  BNS_308: {
    code: 'Section 308',
    act: 'Bharatiya Nyaya Sanhita, 2023 (formerly IPC 384/385)',
    title: 'Extortion and Putting Person in Fear of Injury to Extort Money',
    description:
      'Coercing or blackmailing victim into transferring funds using threats of defamation, arrest, or morphed photos (Loan Apps/Digital Arrest).',
    maxPenalty: 'Imprisonment up to 3 years or 7 years with fine'
  },
  BNS_336: {
    code: 'Section 336',
    act: 'Bharatiya Nyaya Sanhita, 2023 (formerly IPC 468)',
    title: 'Forgery for Purpose of Cheating',
    description:
      'Creating false electronic records, counterfeit bank slips, fake lottery letters, or spoofed bank domains.',
    maxPenalty: 'Imprisonment up to 7 years and fine'
  }
};

function classifyLegalSections(fraudCategory, narrative = '') {
  const text = (narrative + ' ' + fraudCategory).toLowerCase();
  const matched = new Set();

  // Baseline cyber cheating applies to virtually all digital scams
  matched.add(STATUTORY_SECTIONS.IT_ACT_66D);
  matched.add(STATUTORY_SECTIONS.BNS_318_4);

  // Impersonation (Bank, Police, Electricity, Delivery agent, Customs)
  if (
    text.includes('police') ||
    text.includes('officer') ||
    text.includes('bank') ||
    text.includes('manager') ||
    text.includes('customer care') ||
    text.includes('electricity') ||
    text.includes('customs') ||
    text.includes('cbi') ||
    text.includes('digital arrest') ||
    text.includes('impersonat')
  ) {
    matched.add(STATUTORY_SECTIONS.BNS_319);
    matched.add(STATUTORY_SECTIONS.IT_ACT_66C);
  }

  // Blackmail, Threats, Loan Apps, Sextortion, Morphing
  if (
    text.includes('loan') ||
    text.includes('threat') ||
    text.includes('blackmail') ||
    text.includes('arrest') ||
    text.includes('morph') ||
    text.includes('nude') ||
    text.includes('extort') ||
    text.includes('call relatives')
  ) {
    matched.add(STATUTORY_SECTIONS.BNS_308);
  }

  // Phishing links, malicious APKs, Screen-sharing apps (AnyDesk, TeamViewer)
  if (
    text.includes('apk') ||
    text.includes('anydesk') ||
    text.includes('teamviewer') ||
    text.includes('rustdesk') ||
    text.includes('link') ||
    text.includes('app install') ||
    text.includes('otp auto')
  ) {
    matched.add(STATUTORY_SECTIONS.IT_ACT_43);
    matched.add(STATUTORY_SECTIONS.IT_ACT_66C);
  }

  // Fake slips, fake receipts, forged identity documents
  if (
    text.includes('fake slip') ||
    text.includes('fake receipt') ||
    text.includes('qr code') ||
    text.includes('forged') ||
    text.includes('spoof')
  ) {
    matched.add(STATUTORY_SECTIONS.BNS_336);
  }

  return Array.from(matched);
}

module.exports = {
  STATUTORY_SECTIONS,
  classifyLegalSections
};
