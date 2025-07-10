// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:",username);
  db.query(
    `SELECT * FROM users WHERE username = ? OR email = ?`,
    [username, username],
    async (err, results) => {
      if (err) {
        console.error("DB error:",err);
        return res.status(500).send("DB error");
      }
      if (results.length === 0){
        console.warn("User not found");
       return res.status(401).send("User not found");
      }
      const user = results[0];
      console.log("User found:",user);
      try {
        const isMatch = password === user.password_hash || await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          console.warn("⚠ Invalid password");
          return res.status(403).send("Invalid password");
        }

        console.log("✅ Password matched");
        res.json({
          message: "Login successful",
          role: user.role,
          user_id: user.user_id
        });

      } catch (err) {
        console.error("❌ Password comparison failed:", err);
        return res.status(500).send("Password check failed");
      }
    }
  );
});


      

module.exports = router;
