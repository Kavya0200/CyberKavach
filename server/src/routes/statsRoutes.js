const express = require('express');
const router = express.Router();
const { IncidentReportRepository } = require('../models/IncidentReport');

/**
 * GET /api/stats
 * Pure live statistics from MongoDB Atlas
 */
router.get('/', async (req, res) => {
  try {
    const all = await IncidentReportRepository.findAll();
    let totalLoss = 0;
    let totalFrozen = 0;
    let goldenHourCount = 0;

    const categoryCounts = {};

    all.forEach((r) => {
      const amt = Number(r.incident?.amountLost || 0);
      totalLoss += amt;

      if (r.status === 'FUNDS_FROZEN') {
        totalFrozen += amt;
      }
      if (r.triage?.isGoldenHourActive) {
        goldenHourCount++;
      }

      const cat = r.incident?.fraudCategory || 'OTHER';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const frozenCount = all.filter((r) => r.status === 'FUNDS_FROZEN' || r.status === 'BANK_NOTIFIED').length;
    const successRate = all.length > 0 ? Math.round((frozenCount / all.length) * 100) : 0;

    return res.json({
      success: true,
      data: {
        totalComplaints: all.length,
        totalAmountReported: totalLoss,
        totalFundsProtected: totalFrozen,
        goldenHourSuccessRate: all.length > 0 ? `${successRate}%` : '0%',
        activeCasesInGoldenHour: goldenHourCount,
        categoryBreakdown: categoryCounts
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
