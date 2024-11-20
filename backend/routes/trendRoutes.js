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


router.get('/qb-stats/top-performers/:season/:stat', async (req, res) => {
  try {
    const { season, stat } = req.params;
    const result = await db.query('SELECT * FROM get_top_performers($1, $2)', [season, stat]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top performers:', err.stack);
    res.status(500).send('Server error');
  }
});

router.get('/qb-stats/moving-avg/:player_id/:stat', async (req, res) => {
  try {
    const { player_id, stat } = req.params;
    const result = await db.query('SELECT * FROM get_moving_avg_stat($1, $2)', [player_id, stat]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching moving average stats:', err.stack);
    res.status(500).send('Server error');
  }
});

module.exports = router;
