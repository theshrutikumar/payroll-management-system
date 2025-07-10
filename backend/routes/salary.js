const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: /api/salary/:emp_id — fetch latest payroll for an employee
router.get('/:emp_id', (req, res) => {
  const emp_id = req.params.emp_id;

  const query = `
    SELECT * FROM payroll
    WHERE emp_id = ?
    ORDER BY id DESC
    LIMIT 1
  `;

  db.query(query, [emp_id], (err, results) => {
    if (err) {
      console.error("Error fetching payroll:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No payroll found for employee" });
    }

    res.status(200).json(results[0]);
  });
});
// POST: /api/salary/generate
router.post('/generate', (req, res) => {
  const { emp_id, month_year, overtime_hours } = req.body;

  if (!emp_id || !month_year) {
    return res.status(400).json({ message: "Missing required fields" });
  }


  // Fetch employee's basic salary
  db.query("SELECT salary FROM employees WHERE emp_id = ?", [emp_id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).json({ message: "Error fetching employee salary" });
    }

    const basic = parseFloat(result[0].salary);
    const hra = 0.4 * basic;
    const da = 0.2 * basic;
    const overtime = overtime_hours * 100;

    // Count unpaid leaves (assuming unpaid = leave_type = 'Unpaid')
    const leaveQuery = `
      SELECT COUNT(*) AS unpaid_leaves FROM leaves
      WHERE emp_id = ? AND leave_type = 'Unpaid'
        AND DATE_FORMAT(from_date, '%Y-%m') = ?
    `;

    db.query(leaveQuery, [emp_id, month_year], (err, leaveRes) => {
      if (err) return res.status(500).json({ message: "Error fetching leaves" });

      const unpaid_leaves = leaveRes[0].unpaid_leaves || 0;
      const leave_deduction = (basic / 30) * unpaid_leaves;

      // Fixed deduction values
      const pf = 1200;
      const esi = 800;
      const tds = 1200;

      const deductions = leave_deduction + pf + esi + tds;
      const net_salary = (basic + hra + da + overtime) - deductions;

      const insertQuery = `
        INSERT INTO payroll (emp_id, month_year, basic, hra, da, overtime, unpaid_leaves, pf, esi, tds, deductions, net_salary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertQuery, [
        emp_id, month_year, basic, hra, da, overtime,
        unpaid_leaves, pf, esi, tds, deductions, net_salary
      ], (err, result) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ message: "Insert failed" });
        }

        res.status(200).json({ message: "Payroll calculated & saved", payroll_id: result.insertId });

      });
    });
  });
});

module.exports = router;