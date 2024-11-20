const express = require('express');
const db = require('./db');
const qbRoutes = require('./routes/qbRoutes');
const trendRoutes = require('./routes/trendRoutes'); // Import trend routes
const cors = require('cors');

const app = express();
app.use(cors());
const port = 4000;

app.use(express.json());

// Test the database connection
db.testConnection().then(() => {
  console.log('Connected to the database successfully');
}).catch(err => {
  console.error('Failed to connect to the database:', err);
});

// Use the qbRoutes and trendRoutes
app.use('/api', qbRoutes);
app.use('/api', trendRoutes); // Register trend routes

app.get('/', (req, res) => {
  res.send('Welcome to the Quarterback Stats API');
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
