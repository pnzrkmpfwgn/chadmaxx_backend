const express = require('express');
const userRoutes = require('./routes/userRoutes');
const db = require('./db/db');
const app = express();
const PORT = 3000;

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Middleware (optional for JSON parsing)
app.use(express.json());

// // Route: GET all users
// app.get('/users', (req, res) => {
//   db.query('SELECT * FROM users', (err, results) => {
//     if (err) {
//       console.error('Error fetching users:', err);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.json(results);
//     }
//   });
// });

app.use(express.json());
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
