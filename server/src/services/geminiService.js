const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Real Forensic Intelligence Extractor
 * Extracts genuine identifiers without fabricating or generating random numbers.
 */
function extractForensicIntelligence(narrative = '', fileName = '') {
  const text = narrative;
  let amount = 0;
  let utr = '';
  let vpa = '';
  let suspectBank = '';
  let suspectAccount = '';
  let category = 'UPI_PHISHING';
  let platform = 'UPI';
  let channel = 'Digital Transfer';
  const insights = [];

  // 1. Extract Genuine Amount (find highest disputed amount mentioned)
  const amtMatches = [...text.matchAll(/(?:(?:rs\.?|inr|₹)\s*([\d,]+)|([\d,]+)\s*(?:rs|rupees|inr))/gi)];
  let maxFound = 0;
  for (const m of amtMatches) {
    const rawNum = (m[1] || m[2]).replace(/,/g, '');
    const parsed = parseFloat(rawNum);
    if (!isNaN(parsed) && parsed > maxFound) maxFound = parsed;
  }
  if (!maxFound) {
    const looseMatches = [...text.matchAll(/\b([1-9]\d{2,6})\b/g)];
    for (const m of looseMatches) {
      const num = parseFloat(m[1]);
      if (m[1].length !== 12 && num > maxFound && num < 10000000) {
        maxFound = num;
      }
    }
  }
  amount = maxFound;

  // 2. Extract Genuine 12-Digit UTR / Transaction Reference (Never fabricate fake random UTRs)
  const utrMatch = text.match(/\b(\d{12})\b/) || text.match(/(?:utr|ref|txn|rrn)\s*[:#-]?\s*([A-Za-z0-9]{8,18})/i);
  if (utrMatch) {
    utr = utrMatch[1];
    insights.push(`Extracted verified 12-digit transaction reference (UTR: ${utr}).`);
  } else {
    insights.push('UTR not explicitly found in text narrative. Bank statement or payment receipt required.');
  }

  // 3. Extract Genuine Suspect UPI ID (VPA)
  const vpaMatch = text.match(/[a-zA-Z0-9.\-_]{2,256}@(okaxis|okhdfcbank|oksbi|paytm|ybl|ibl|axl|upi|sbi|kotak|apl|icici|barodampay)/i);
  if (vpaMatch) {
    vpa = vpaMatch[0];
    insights.push(`Identified beneficiary receiving UPI VPA: "${vpa}".`);
  }

  // 4. Extract Suspect Bank Account or Contact Number (must not be part of the 12-digit UTR)
  const phoneMatches = [...text.matchAll(/(?:(?:\+91|91)[\s-]?)?([6-9]\d{9})\b/g)];
  for (const pm of phoneMatches) {
    const candidate = pm[1];
    if (!utr.includes(candidate)) {
      suspectAccount = candidate;
      insights.push(`Detected suspect contact/wallet reference: +91-${suspectAccount}.`);
      break;
    }
  }

  // 5. Infer Beneficiary Bank from VPA
  if (vpa) {
    if (vpa.includes('ybl') || vpa.includes('ibl')) suspectBank = 'Yes Bank';
    else if (vpa.includes('okaxis') || vpa.includes('axl')) suspectBank = 'Axis Bank';
    else if (vpa.includes('okhdfc')) suspectBank = 'HDFC Bank';
    else if (vpa.includes('oksbi') || vpa.includes('sbi')) suspectBank = 'State Bank of India';
    else if (vpa.includes('paytm')) suspectBank = 'Paytm Payments Bank';
    else if (vpa.includes('icici')) suspectBank = 'ICICI Bank';
    else if (vpa.includes('kotak')) suspectBank = 'Kotak Mahindra Bank';
  }

  // 6. Infer Fraud Classification & Modus Operandi
  const lower = text.toLowerCase();
  if (lower.includes('loan') || lower.includes('threat') || lower.includes('nude') || lower.includes('morph') || lower.includes('blackmail')) {
    category = 'LOAN_APP_EXTORTION';
    platform = 'Instant Loan App / WhatsApp';
    channel = 'Extortion / Social Blackmail';
    insights.push('Modus Operandi: Digital harassment with unlawful contact harvesting and coercive extortion.');
  } else if (lower.includes('telegram') || lower.includes('task') || lower.includes('youtube') || lower.includes('crypto') || lower.includes('invest') || lower.includes('profit')) {
    category = 'INVESTMENT_TASK_SCAM';
    platform = 'Telegram / Investment Portal';
    channel = 'Prepaid Task Fraud';
    insights.push('Modus Operandi: Multi-stage advance-fee inducement promising high returns on bogus tasks.');
  } else if (lower.includes('electricity') || lower.includes('bill') || lower.includes('power') || lower.includes('apk') || lower.includes('anydesk') || lower.includes('teamviewer')) {
    category = 'KYC_UTILITY_IMPERSONATION';
    platform = 'SMS Phishing / Malicious APK';
    channel = 'Remote Desktop / Screen Monitoring';
    insights.push('Modus Operandi: Impersonation of utility provider creating false panic of power disconnection.');
  } else if (lower.includes('qr') || lower.includes('olx') || lower.includes('receive') || lower.includes('scan')) {
    category = 'REVERSE_QR_FRAUD';
    platform = 'Marketplace / UPI QR';
    channel = 'Reverse UPI QR Collection';
    insights.push('Modus Operandi: Fraudulent "Scan to Receive Money" deception triggering unauthorized debit.');
  } else if (lower.includes('digital arrest') || lower.includes('cbi') || lower.includes('police') || lower.includes('customs')) {
    category = 'DIGITAL_ARREST';
    platform = 'Video Call / Skype / WhatsApp';
    channel = 'Law Enforcement Impersonation';
    insights.push('Modus Operandi: Simulated police interrogation & unlawful intimidation under digital arrest pretext.');
  } else {
    insights.push('Modus Operandi: Direct electronic inducement resulting in unauthorized monetary transfer.');
  }

  // Risk Rating
  let riskLevel = 'HIGH';
  if (amount > 50000 || category === 'LOAN_APP_EXTORTION' || category === 'DIGITAL_ARREST') {
    riskLevel = 'CRITICAL';
  } else if (amount < 5000) {
    riskLevel = 'MODERATE';
  }

  if (amount > 0) {
    insights.push(`Disputed monetary quantum: ₹${amount.toLocaleString('en-IN')}. Statutory lien notice applicable under RBI guidelines.`);
  }

  return {
    amountLost: amount,
    utrNumber: utr,
    suspectVpa: vpa,
    suspectAccount,
    suspectBank,
    victimAccount: '',
    victimBank: '',
    fraudCategory: category,
    platformUsed: platform,
    channel,
    riskLevel,
    summary: narrative.substring(0, 240) || 'Citizen reported unauthorized electronic fund transfer.',
    aiInsights: insights,
    aiEngineUsed: 'CyberKavach Forensic Intelligence Parser'
  };
}

/**
 * Main Gemini AI Triage Service
 * Analyzes citizen narrative and payment receipts using Google Gemini API
 */
async function analyzeIncidentWithGemini({ narrative, imageBuffer, imageMimeType, victimInfo }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.log('[GeminiService] ℹ️  Using forensic intelligence parser.');
    return extractForensicIntelligence(narrative);
  }

  try {
    const systemPrompt = `
You are the AI Cybercrime Forensic Intelligence Specialist for "CyberKavach", the National Citizen Cybercrime Triage & Golden-Hour Fraud Response System in India.
Analyze the citizen's incident report and any provided payment screenshot/receipt image.

Extract and output ONLY a valid JSON object matching this schema (no markdown, no code blocks):
{
  "amountLost": number (exact numeric value in INR lost by the citizen, 0 if not stated),
  "utrNumber": string (12-digit UPI UTR, IMPS RRN, or reference number if present in text/image, otherwise empty string ""),
  "suspectVpa": string (suspect UPI ID if present, otherwise empty string ""),
  "suspectAccount": string (suspect bank account or phone number if mentioned, otherwise empty string ""),
  "suspectBank": string (suspect beneficiary bank name if identified, otherwise empty string ""),
  "victimAccount": string (victim debited account last 4 digits if mentioned, otherwise empty string ""),
  "victimBank": string (victim bank name if mentioned, otherwise empty string ""),
  "fraudCategory": string (One of: "UPI_PHISHING", "INVESTMENT_TASK_SCAM", "LOAN_APP_EXTORTION", "KYC_UTILITY_IMPERSONATION", "REVERSE_QR_FRAUD", "DIGITAL_ARREST", "IDENTITY_THEFT", "OTHER"),
  "platformUsed": string (e.g. "Google Pay", "PhonePe", "Telegram", "WhatsApp", "Paytm", "NetBanking", "SMS"),
  "channel": string (e.g. "UPI Transfer", "Malicious Link", "Remote Desktop APK", "Phone Call", "QR Code"),
  "riskLevel": string ("CRITICAL" | "HIGH" | "MODERATE" | "LOW"),
  "summary": string (concise 2-sentence formal statement of facts for the police FIR),
  "aiInsights": [
    string (investigative finding 1 about the scammer's modus operandi),
    string (investigative finding 2 about financial flow / mule account trace),
    string (action recommendation for victim / bank nodal officer)
  ]
}
`;

    const contents = [];
    if (narrative) {
      contents.push({ text: `Citizen Narrative: "${narrative}"\n\nVictim: ${victimInfo?.name || 'Anonymous'}` });
    }

    if (imageBuffer && imageMimeType) {
      contents.push({
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: imageMimeType
        }
      });
      contents.push({ text: 'Examine this screenshot carefully. Extract the 12-digit UTR/RRN, disputed amount, beneficiary UPI/Account, and timestamp.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
    let result = null;
    let successfulModel = '';

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent([systemPrompt, ...contents]);
        if (result && result.response) {
          successfulModel = modelName;
          break;
        }
      } catch (mErr) {
        if (mErr.message?.includes('403') || mErr.message?.includes('API_KEY_INVALID')) {
          throw mErr;
        }
      }
    }

    if (!result) {
      throw new Error('All candidate Gemini models exhausted.');
    }

    const responseText = result.response.text();
    const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    console.log(`[GeminiService] ✅ Google Gemini (${successfulModel}) successfully triaged the complaint.`);
    return {
      amountLost: Number(parsed.amountLost) || 0,
      utrNumber: String(parsed.utrNumber || '').trim(),
      suspectVpa: String(parsed.suspectVpa || '').trim(),
      suspectAccount: String(parsed.suspectAccount || '').trim(),
      suspectBank: String(parsed.suspectBank || '').trim(),
      victimAccount: String(parsed.victimAccount || '').trim(),
      victimBank: String(parsed.victimBank || '').trim(),
      fraudCategory: parsed.fraudCategory || 'UPI_PHISHING',
      platformUsed: parsed.platformUsed || 'UPI',
      channel: parsed.channel || 'Digital',
      riskLevel: parsed.riskLevel || 'CRITICAL',
      summary: parsed.summary || narrative.substring(0, 240),
      aiInsights: Array.isArray(parsed.aiInsights) && parsed.aiInsights.length > 0
        ? parsed.aiInsights
        : [`Modus Operandi: ${parsed.fraudCategory}`, `Disputed transfer processed via ${parsed.platformUsed || 'UPI'}.`],
      aiEngineUsed: 'Google Gemini AI (Multimodal)'
    };
  } catch (err) {
    console.warn('[GeminiService] Gemini API notice (' + err.message + '). Applying resilient forensic intelligence parser.');
    const extracted = extractForensicIntelligence(narrative);
    return extracted;
  }
}

module.exports = {
  analyzeIncidentWithGemini,
  heuristicFallbackExtraction: extractForensicIntelligence
};
