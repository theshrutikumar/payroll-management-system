const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Monthly Salary Report
router.get('/salary/:month_year', (req, res) => {
  

  const { month_year } = req.params;
console.log("Fetching salary report for:", month_year);
  const sql = `
    SELECT e.emp_id, e.name, p.month_year, p.basic, p.hra, p.da, p.overtime,
           p.pf, p.esi, p.tds, p.deductions, p.net_salary
    FROM employees e
    JOIN payroll p ON e.emp_id = p.emp_id
    WHERE p.month_year = ?
  `;

  db.query(sql, [month_year], (err, result) => {
    if (err) {
    console.error("SQL ERROR:", err);
    return res.status(500).json({ message: "Salary report error" });
}

    res.json(result);
  });
});

// 2. Attendance Report
router.get('/attendance/:emp_id', (req, res) => {
  const emp_id = req.params.emp_id;

  const sql = `
    SELECT date, status
    FROM attendance
    WHERE emp_id = ?
    ORDER BY date DESC
  `;

  db.query(sql, [emp_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Attendance fetch error" });
    res.json(result);
  });
});

module.exports = router;