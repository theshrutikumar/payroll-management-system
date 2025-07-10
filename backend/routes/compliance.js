const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: /api/compliance/:month_year
router.get('/:month_year', (req, res) => {
  const month_year = req.params.month_year; // Format: YYYY-MM

  const sql = `
    SELECT emp_id, month_year, pf, esi, tds
    FROM payroll
    WHERE month_year = ?
  `;

  db.query(sql, [month_year], (err, results) => {
    if (err) {
      console.error("Compliance report error:", err);
      return res.status(500).json({ message: "Failed to fetch compliance report" });
    }

    res.status(200).json(results);
  });
});

module.exports = router;