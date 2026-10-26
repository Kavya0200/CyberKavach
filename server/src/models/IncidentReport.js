const mongoose = require('mongoose');
const { inMemoryStore } = require('../config/db');

const IncidentReportSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    victim: {
      name: { type: String, default: 'Anonymous Citizen' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      aadhaarLast4: { type: String, default: '' }
    },
    incident: {
      narrative: { type: String, required: true },
      fraudCategory: { type: String, default: 'UPI_PHISHING' },
      amountLost: { type: Number, required: true, default: 0 },
      currency: { type: String, default: 'INR' },
      incidentDate: { type: Date, default: Date.now },
      platformUsed: { type: String, default: 'UPI' },
      channel: { type: String, default: 'WhatsApp / SMS' }
    },
    financialDetails: {
      utrNumber: { type: String, default: '' },
      suspectVpa: { type: String, default: '' },
      suspectAccount: { type: String, default: '' },
      suspectBank: { type: String, default: '' },
      victimAccount: { type: String, default: '' },
      victimBank: { type: String, default: '' }
    },
    legalSections: [
      {
        code: String,
        act: String,
        title: String,
        description: String,
        maxPenalty: String
      }
    ],
    evidence: [
      {
        id: String,
        fileName: String,
        fileType: String,
        fileSize: Number,
        sha256Hash: String,
        dataUrl: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    triage: {
      riskLevel: {
        type: String,
        enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'],
        default: 'CRITICAL'
      },
      goldenHourRemainingMinutes: { type: Number, default: 120 },
      isGoldenHourActive: { type: Boolean, default: true },
      aiInsights: [String],
      aiEngineUsed: { type: String, default: 'Google Gemini AI' },
      recommendedActions: [String],
      call1930Script: String,
      bankFreezeDraft: String
    },
    status: {
      type: String,
      enum: [
        'TRIAGED',
        'BANK_NOTIFIED',
        'FIR_DRAFTED',
        'POLICE_SUBMITTED',
        'FUNDS_FROZEN',
        'CLOSED'
      ],
      default: 'TRIAGED'
    },
    timeline: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
        performedBy: { type: String, default: 'System' }
      }
    ]
  },
  {
    timestamps: true
  }
);

const MongoIncidentReport = mongoose.models.IncidentReport || mongoose.model('IncidentReport', IncidentReportSchema);

// Hybrid Data Access Layer that seamlessly uses MongoDB when connected, or inMemoryStore otherwise
class IncidentReportRepository {
  static async create(data) {
    if (inMemoryStore.isConnected) {
      try {
        return await MongoIncidentReport.create(data);
      } catch (err) {
        console.error('MongoDB write error, falling back to inMemoryStore:', err.message);
      }
    }
    const report = {
      ...data,
      _id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryStore.reports.set(report.complaintId, report);
    return report;
  }

  static async findByIdOrComplaintId(idOrCode) {
    if (inMemoryStore.isConnected) {
      try {
        const found = await MongoIncidentReport.findOne({
          $or: [{ _id: mongoose.isValidObjectId(idOrCode) ? idOrCode : null }, { complaintId: idOrCode }]
        });
        if (found) return found;
      } catch (err) {
        console.error('MongoDB read error:', err.message);
      }
    }
    for (const [code, rep] of inMemoryStore.reports.entries()) {
      if (code === idOrCode || rep._id === idOrCode) {
        return rep;
      }
    }
    return null;
  }

  static async findAll(filter = {}) {
    if (inMemoryStore.isConnected) {
      try {
        return await MongoIncidentReport.find(filter).sort({ createdAt: -1 });
      } catch (err) {
        console.error('MongoDB read error:', err.message);
      }
    }
    const all = Array.from(inMemoryStore.reports.values());
    return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async updateStatus(idOrCode, newStatus, note, performedBy = 'Cyber Officer') {
    const event = {
      status: newStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${newStatus}`,
      performedBy
    };

    if (inMemoryStore.isConnected) {
      try {
        const updated = await MongoIncidentReport.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(idOrCode) ? idOrCode : null }, { complaintId: idOrCode }] },
          {
            $set: { status: newStatus },
            $push: { timeline: event }
          },
          { new: true }
        );
        if (updated) return updated;
      } catch (err) {
        console.error('MongoDB update error:', err.message);
      }
    }

    const report = await this.findByIdOrComplaintId(idOrCode);
    if (report) {
      report.status = newStatus;
      report.timeline = report.timeline || [];
      report.timeline.push(event);
      report.updatedAt = new Date();
      inMemoryStore.reports.set(report.complaintId, report);
      return report;
    }
    return null;
  }
}

module.exports = {
  MongoIncidentReport,
  IncidentReportRepository
};
