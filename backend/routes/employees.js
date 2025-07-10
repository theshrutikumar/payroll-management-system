const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all employees
router.get('/', (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).json({message:"DB error"});
    res.json(results);
  });
});



// POST new employee
router.post('/', (req, res) => {
  const { name, dob, department, designation, salary, joining_date, created_by } = req.body;

  const sql = `
    INSERT INTO employees (name, dob, department, designation, salary, joining_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, dob, department, designation, salary, joining_date, created_by], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({message:"DB insert error"});
    }
    res.json({ message: "Employee added", id: result.insertId });
  });
});

// PUT update employee
router.put('/:id', (req, res) => {
  const { name, dob, department, designation, salary, joining_date } = req.body;

  const sql = `
    UPDATE employees SET name=?, dob=?, department=?, designation=?, salary=?, joining_date=? WHERE emp_id=?`;

  db.query(sql, [name, dob, department, designation, salary, joining_date, req.params.id], (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({message:"DB update error"});
    }
    res.json({ message: "Employee updated" });
  });
});

// DELETE employee
router.delete('/:id', (req, res) => {
  db.query("DELETE FROM employees WHERE emp_id=?", [req.params.id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({message:"DB delete error"});
    }
    res.json({ message: "Employee deleted" });
  });
});

module.exports = router;