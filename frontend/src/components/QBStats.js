// QBStats.js
import React, { useEffect, useState } from 'react';
import './QBStats.css';

const QBStats = () => {
  const [qbData, setQbData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/qb-stats')
      .then(response => response.json())
      .then(data => setQbData(data))
      .catch(error => console.error('Error fetching QB data:', error));
  }, []);

  return (
    <div className="qb-stats-container">
      <h2 className="qb-stats-title">Quarterback Statistics</h2>
      <table className="qb-stats-table">
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Team</th>
            <th>Season</th>
            <th>Week</th>
            <th>Passing Yards</th>
            <th>Touchdowns</th>
            <th>Interceptions</th>
          </tr>
        </thead>
        <tbody>
          {qbData.map((qb, index) => (
            <tr key={index}>
              <td>{qb.player_name}</td>
              <td>{qb.team}</td>
              <td>{qb.season}</td>
              <td>{qb.week}</td>
              <td>{qb.passing_yards}</td>
              <td>{qb.touchdowns}</td>
              <td>{qb.interceptions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QBStats;
