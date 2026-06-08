// eslint-disable-next-line simple-import-sort/imports
import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import achievementRouter from './routes/achievementRouter';
import adminUserManagementRouter from './routes/adminUserManagementRouter';
import aiRouter from './routes/aiRouter/aiRouter';
import appointmentRouter from './routes/appointmentRouter';
import authRouter from './routes/authRouter/authRouter';
import biomarkerRouter from './routes/biomarkerRouter/biomarkerRouter';
import bloodTestRouter from './routes/bloodTestRouter/bloodTestRouter';
import chatRouter from './routes/chatRouter/chatRouter';
import dashboardRouter from './routes/dashboardRouter/dashboardRouter';
import deepResearchRouter from './routes/deepResearchRouter/deepResearchRouter';
import labRouter from './routes/labRouter';
import llmRouter from './routes/llmRouter/llmRouter';
import notificationRouter from './routes/notificationRouter/notificationRouter';
import panelRouter from './routes/panelRouter/panelRouter';
import partnerApplicationRouter from './routes/partnerApplicationRouter/partnerApplicationRouter';
import partnerRouter from './routes/partnerRouter/partnerRouter';
import performanceRouter from './routes/performanceRouter/performanceRouter';
import profileRouter from './routes/profileRouter/profileRouter';
import settingsRouter from './routes/settingsRouter/settingsRouter';
import uploadRouter from './routes/uploadRouter';

const app = express();

app.disable('etag');
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PREVIEW,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.get('/', (_req, res) => res.send('API OK'));
app.get('/health', (_req, res) =>
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
);

app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/deep-research', deepResearchRouter);
app.use('/api/panels', panelRouter);
app.use('/api/biomarkers', biomarkerRouter);
app.use('/api/blood-tests', bloodTestRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/profile', profileRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/partner-applications', partnerApplicationRouter);
app.use('/api/partners', partnerRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/achievements', achievementRouter);
app.use('/api/admin', adminUserManagementRouter);
app.use('/api/llm', llmRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/labs', labRouter);
app.use('/api/notifications', notificationRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
