const express = require('express');
const router = express.Router();
const { IncidentReportRepository } = require('../models/IncidentReport');
const { generateFIRDossier } = require('../services/actionDraftService');

/**
 * GET /api/reports
 * Fetch all reports for the Cyber Cell Officer Dashboard
 */
router.get('/', async (req, res) => {
  try {
    const reports = await IncidentReportRepository.findAll();
    return res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/reports/:id
 * Fetch single report by MongoDB _id or complaintId (e.g. CK-2026-XXXXX)
 */
router.get('/:id', async (req, res) => {
  try {
    const report = await IncidentReportRepository.findByIdOrComplaintId(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    return res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/reports/:id/status
 * Update status (for Officer actions: BANK_NOTIFIED, FIR_DRAFTED, POLICE_SUBMITTED, FUNDS_FROZEN)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, note, performedBy } = req.body;
    const validStatuses = [
      'TRIAGED',
      'BANK_NOTIFIED',
      'FIR_DRAFTED',
      'POLICE_SUBMITTED',
      'FUNDS_FROZEN',
      'CLOSED'
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await IncidentReportRepository.updateStatus(
      req.params.id,
      status,
      note || `Status updated to ${status}`,
      performedBy || 'Cyber Cell Officer'
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/reports/:id/dossier
 * Get full court-ready FIR Dossier object
 */
router.get('/:id/dossier', async (req, res) => {
  try {
    const report = await IncidentReportRepository.findByIdOrComplaintId(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    const dossier = generateFIRDossier({
      victim: report.victim,
      financialDetails: report.financialDetails,
      incident: report.incident,
      legalSections: report.legalSections,
      evidence: report.evidence,
      complaintId: report.complaintId
    });

    return res.json({ success: true, data: dossier });
  } catch (error) {
    console.error('Error generating dossier:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
