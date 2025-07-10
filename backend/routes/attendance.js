const express = require('express');
const router = express.Router();
const db = require('../db');

// Add attendance (HR/Admin)
router.post('/', (req, res) => {
  const { emp_id, date, status } = req.body;

  const sql = `
    INSERT INTO attendance (emp_id, date, status)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status)`;

  db.query(sql, [emp_id, date, status], (err, result) => {
    if (err) return res.status(500).json({message:"Error recording attendance"});
    res.json({ message: "Attendance saved/updated" });
  });
});

// Get attendance for an employee (Admin or self-view)
router.get('/:emp_id', (req, res) => {
  const { emp_id } = req.params;

  db.query("SELECT * FROM attendance WHERE emp_id = ?", [emp_id], (err, rows) => {
    if (err) return res.status(500).json({message:"Error fetching attendance"});
    res.json(rows);
  });
});

module.exports = router;