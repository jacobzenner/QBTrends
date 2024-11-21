// trendRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/qb-stats/average-passing-yards', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM get_average_passing_yards()');
    const sortedResult = result.rows.reverse();
    res.json(sortedResult);
  } catch (err) {
    console.error('Error fetching average passing yards:', err.stack);
    res.status(500).send('Server error');
  }
});

// Endpoint for fetching the player with the highest total passing yards
router.get('/qb-stats/highest-passing-yards', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM get_highest_passing_yards()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching highest passing yards:', err.stack);
    res.status(500).send('Server error');
  }
});

// Endpoint for fetching the player with the highest passing EPA
router.get('/qb-stats/highest-passing-epa', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM get_highest_passing_epa()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching highest passing EPA:', err.stack);
    res.status(500).send('Server error');
  }
});

// Endpoint for fetching the player with the highest total passing TDs
router.get('/qb-stats/highest-passing-tds', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM get_highest_passing_tds()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching highest passing TDs:', err.stack);
    res.status(500).send('Server error');
  }
});

// Endpoint for fetching average TDs and INTs over the last 4 weeks
router.get('/qb-stats/average-tds-ints', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM get_average_tds_ints()');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching average TDs and INTs:', err.stack);
    res.status(500).send('Server error');
  }
});

module.exports = router;
