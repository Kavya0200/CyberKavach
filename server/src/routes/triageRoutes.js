const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const { analyzeIncidentWithGemini } = require('../services/geminiService');
const { classifyLegalSections } = require('../services/legalClassifier');
const {
  generate1930CallScript,
  generateBankFreezeNotice,
  generateFIRDossier,
  generateNextStepsGuide
} = require('../services/actionDraftService');
const { IncidentReportRepository } = require('../models/IncidentReport');

// Configure Multer for memory buffer storage (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

/**
 * POST /api/triage
 * Intake victim narrative and optional payment/chat screenshot
 */
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { narrative, name, phone, email, city, state, aadhaarLast4, manualAmount } = req.body;

    if (!narrative || narrative.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a brief description of what happened.'
      });
    }

    const victimInfo = {
      name: name?.trim() || 'Anonymous Citizen',
      phone: phone?.trim() || '',
      email: email?.trim() || '',
      city: city?.trim() || 'New Delhi',
      state: state?.trim() || 'Delhi',
      aadhaarLast4: aadhaarLast4?.trim() || 'XXXX'
    };

    // 1. Process Evidence Image & calculate SHA-256 tamper-proof hash
    const evidenceList = [];
    let imageBuffer = null;
    let imageMimeType = null;

    if (req.file) {
      imageBuffer = req.file.buffer;
      imageMimeType = req.file.mimetype;
      const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

      evidenceList.push({
        id: 'ev_' + Date.now(),
        fileName: req.file.originalname || 'payment_receipt.png',
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        sha256Hash: hash,
        dataUrl: `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`,
        uploadedAt: new Date()
      });
    }

    // 2. Gemini Multimodal / Text Extraction
    const extracted = await analyzeIncidentWithGemini({
      narrative,
      imageBuffer,
      imageMimeType,
      victimInfo
    });

    if (manualAmount && !isNaN(parseFloat(manualAmount)) && parseFloat(manualAmount) > 0) {
      extracted.amountLost = parseFloat(manualAmount);
    }

    // 3. Classify Legal Sections under IT Act & BNS
    const legalSections = classifyLegalSections(extracted.fraudCategory, narrative);

    // 4. Generate Unique Complaint Reference Number
    const year = new Date().getFullYear();
    const randomHex = Math.floor(10000 + Math.random() * 90000);
    const complaintId = `CK-${year}-${randomHex}`;

    // 5. Golden-Hour Calculation (120 minutes window)
    const incidentTime = new Date();
    const minutesElapsed = 18; // Default initial response time window
    const goldenHourRemaining = Math.max(0, 120 - minutesElapsed);

    // 6. Generate Statutory Action Drafts
    const call1930Script = generate1930CallScript({
      victim: victimInfo,
      financialDetails: extracted,
      incident: { amountLost: extracted.amountLost, incidentDate: incidentTime },
      complaintId
    });

    const bankFreezeDraft = generateBankFreezeNotice({
      victim: victimInfo,
      financialDetails: extracted,
      incident: {
        amountLost: extracted.amountLost,
        incidentDate: incidentTime,
        fraudCategory: extracted.fraudCategory
      },
      legalSections,
      complaintId
    });

    const nextSteps = generateNextStepsGuide({
      fraudCategory: extracted.fraudCategory,
      financialDetails: extracted,
      complaintId
    });

    const firDossier = generateFIRDossier({
      victim: victimInfo,
      financialDetails: extracted,
      incident: {
        narrative,
        summary: extracted.summary,
        amountLost: extracted.amountLost
      },
      legalSections,
      evidence: evidenceList,
      complaintId
    });

    // 7. Save Report in Repository
    const reportData = {
      complaintId,
      victim: victimInfo,
      incident: {
        narrative,
        summary: extracted.summary,
        fraudCategory: extracted.fraudCategory,
        amountLost: extracted.amountLost,
        currency: 'INR',
        incidentDate: incidentTime,
        platformUsed: extracted.platformUsed,
        channel: extracted.channel
      },
      financialDetails: {
        utrNumber: extracted.utrNumber,
        suspectVpa: extracted.suspectVpa,
        suspectAccount: extracted.suspectAccount,
        suspectBank: extracted.suspectBank,
        victimAccount: extracted.victimAccount,
        victimBank: extracted.victimBank
      },
      legalSections,
      evidence: evidenceList,
      triage: {
        riskLevel: extracted.riskLevel,
        goldenHourRemainingMinutes: goldenHourRemaining,
        isGoldenHourActive: goldenHourRemaining > 0,
        aiInsights: extracted.aiInsights || [],
        aiEngineUsed: extracted.aiEngineUsed || 'Google Gemini AI',
        recommendedActions: [
          'Call 1930 immediately with the generated UTR script',
          'Transmit Bank Freeze Notice to Nodal Grievance Officer',
          'Download FIR Complaint Dossier for local Cyber Police Station'
        ],
        call1930Script,
        bankFreezeDraft,
        nextSteps
      },
      status: 'TRIAGED',
      timeline: [
        {
          status: 'TRIAGED',
          timestamp: new Date(),
          note: 'Incident triaged and legal sections mapped by CyberKavach AI engine.',
          performedBy: 'CyberKavach Triage Engine'
        }
      ]
    };

    const savedReport = await IncidentReportRepository.create(reportData);

    return res.status(201).json({
      success: true,
      data: savedReport,
      firDossier
    });
  } catch (error) {
    console.error('Triage route error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process triage. ' + error.message
    });
  }
});

module.exports = router;
