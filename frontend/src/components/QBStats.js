import React, { useEffect, useState } from 'react';
import TrendsChart from './TrendsChart';
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
      {qbData.length > 0 && <TrendsChart playerId={qbData[0].player_id} />}
    </div>
  );
};

export default QBStats;
