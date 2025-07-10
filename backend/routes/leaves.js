const express = require('express');
const router = express.Router();
const db = require('../db');

// Apply for leave
router.post('/', (req, res) => {
  const { emp_id, from_date, to_date, leave_type, reason } = req.body;

  const sql = `
    INSERT INTO leaves (emp_id, from_date, to_date, leave_type, reason)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [emp_id, from_date, to_date, leave_type, reason], (err, result) => {
    if (err) return res.status(500).json({message:"Leave application failed"});
    res.json({ message: "Leave applied successfully", leave_id: result.insertId });
  });
});

// Get leaves by employee
router.get('/:emp_id', (req, res) => {
  db.query("SELECT * FROM leaves WHERE emp_id = ?", [req.params.emp_id], (err, results) => {
    if (err) return res.status(500).json({message:"Could not fetch leaves"});
    res.json(results);
  });
});

// Approve/Reject leave (HR/Admin)
router.post('/:leave_id', (req, res) => {
  const { status } = req.body;

  db.query("UPDATE leaves SET status = ? WHERE leave_id = ?", [status, req.params.leave_id], (err) => {
    if (err) return res.status(500).json({message:"Failed to update leave status"});
    res.json({ message: "Leave status updated" });
  });
});

module.exports = router;