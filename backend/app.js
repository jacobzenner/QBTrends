// app.js

const express = require('express');
const db = require('./db');  // Import the db.js module
const qbRoutes = require('./routes/qbRoutes'); // Import qbRoutes
const cors = require('cors');

const app = express();
app.use(cors());
const port = 4000;

app.use(express.json());

// Test the database connection when the app starts
db.testConnection().then(() => {
  console.log('Connected to the database successfully');
}).catch(err => {
  console.error('Failed to connect to the database:', err);
});

// Use the qbRoutes for quarterback-related endpoints
app.use('/api', qbRoutes); // This should mount the routes at /api

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Quarterback Stats API');
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
