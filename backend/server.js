const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = require('./db');
const employeeRoutes = require('./routes/employees');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leaves');
const salaryRoutes = require('./routes/salary');
const complianceRoutes = require('./routes/compliance');
const reportRoutes = require('./routes/reports');


app.use('/api/auth', authRoutes);
app.use('/api/employees',employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/reports', reportRoutes);
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
