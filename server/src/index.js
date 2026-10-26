const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/triage', require('./routes/triageRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CyberKavach AI Citizen Cybercrime Triage API',
    version: '1.0.0',
    documentation: 'https://github.com/Kavya0200/CyberKavach#readme',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      reports: '/api/reports',
      triage: '/api/triage',
      auth: '/api/auth'
    },
    evaluatorCredentials: {
      citizen: 'evaluator@cyberkavach.gov.in (password: evaluator123)',
      officer: 'officer@cyberkavach.gov.in (password: police123)'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ACTIVE',
    service: 'CyberKavach Backend Triage Engine',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE')
  });
});

// Connect to Database and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️  CYBERKAVACH API ENGINE STARTED ON PORT: ${PORT}`);
    console.log(`📍 Endpoint: http://localhost:${PORT}`);
    console.log(`🛡️  Health:   http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
});

module.exports = app;
