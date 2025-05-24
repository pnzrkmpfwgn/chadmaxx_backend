const bcrypt = require('bcrypt');
const db = require('../db'); // your db connection instance

const registerUser = async (req, res) => {
  const { username, email, password, gender, age, telno, address } = req.body;

  try {
    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({success:false, message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.query(
        'INSERT INTO users (Username, Email, Password, Gender, Age, Telno, Address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, gender, age, telno, address],
        (err, result) => {
          if (err) return res.status(500).json({success:false, error: 'Database error' });

          res.status(201).json({success:true, message: 'User registered successfully' });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({success:false, error: 'Database error' });

    if (results.length === 0) {
      return res.status(404).json({success:false, message: 'User not found' });
    }

    const user = results[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({success:false, message: 'Invalid credentials' });
    }

    // Normally you'd return a token here
    res.json({success:true, message: 'Login successful', userId: user.id });
  });
};

module.exports = { registerUser, loginUser };
