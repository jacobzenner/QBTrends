// routes/qbRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/qb-stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        qb.id AS player_id, 
        qb.name AS player_name, 
        qb.team, 
        qws.season, 
        qws.week, 
        qws.completions, 
        qws.attempts, 
        qws.passing_yards, 
        qws.passing_tds AS touchdowns, 
        qws.interceptions, 
        qws.sacks, 
        qws.passing_air_yards, 
        qws.passing_yards_after_catch, 
        qws.passing_first_downs, 
        qws.passing_epa, 
        qws.passing_2pt_conversions, 
        qws.fantasy_points, 
        qws.fantasy_points_ppr
      FROM quarterback qb
      JOIN qb_weekly_stats qws ON qb.id = qws.player_id
      ORDER BY qb.name, qws.season, qws.week
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching quarterback stats:', err.stack);
    res.status(500).send('Server error');
  }
});

module.exports = router;
