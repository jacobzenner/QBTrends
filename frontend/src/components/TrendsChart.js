import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrendsChart = () => {
  const [trendData, setTrendData] = useState([]);
  const [highestPassingEPA, setHighestPassingEPA] = useState(null);
  const [highestPassingYards, setHighestPassingYards] = useState(null);
  const [highestPassingTDs, setHighestPassingTDs] = useState(null);
  const [averageTDsINTs, setAverageTDsINTs] = useState([]);

  useEffect(() => {
    // Fetch average passing yards over the last 4 weeks
    fetch(`http://localhost:4000/api/qb-stats/average-passing-yards`)
      .then(response => response.json())
      .then(data => {
        console.log('Trend data fetched (from backend already sorted):', data);
        setTrendData(data);  // Backend will now return sorted data in ascending order
      })
      .catch(error => console.error('Error fetching trend data:', error));

    // Fetch player with highest average passing EPA
    fetch(`http://localhost:4000/api/qb-stats/highest-passing-epa`)
      .then(response => response.json())
      .then(data => setHighestPassingEPA(data))
      .catch(error => console.error('Error fetching highest passing EPA:', error));

    // Fetch player with highest total passing yards
    fetch(`http://localhost:4000/api/qb-stats/highest-passing-yards`)
      .then(response => response.json())
      .then(data => setHighestPassingYards(data))
      .catch(error => console.error('Error fetching highest passing yards:', error));

    // Fetch player with highest total passing TDs
    fetch(`http://localhost:4000/api/qb-stats/highest-passing-tds`)
      .then(response => response.json())
      .then(data => setHighestPassingTDs(data))
      .catch(error => console.error('Error fetching highest passing TDs:', error));

    // Fetch average passing TDs and INTs per week over the last 4 weeks
    fetch(`http://localhost:4000/api/qb-stats/average-tds-ints`)
      .then(response => response.json())
      .then(data => setAverageTDsINTs(data))
      .catch(error => console.error('Error fetching average TDs and INTs:', error));
  }, []);

  // Prepare the chart data for average passing yards
  const chartData = {
    labels: trendData.map((data) => `Week ${data.week}`),
    datasets: [
      {
        label: 'Average Passing Yards (Last 4 Weeks)',
        data: trendData.map((data) => parseFloat(data.average_passing_yards)), // Ensure numerical values
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Prepare the chart data for the highest passing EPA player
  const highestPassingEPAData = highestPassingEPA ? {
    labels: ['Passing Yards', 'Touchdowns', 'Interceptions'],
    datasets: [
      {
        label: `Player: ${highestPassingEPA.player_name} (Highest Passing EPA)`,
        data: [
          highestPassingEPA.passing_yards,
          highestPassingEPA.touchdowns,
          highestPassingEPA.interceptions
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  } : null;

  // Prepare the chart data for the highest passing yards player
  const highestPassingYardsData = highestPassingYards ? {
    labels: ['Passing Yards', 'Touchdowns', 'Interceptions'],
    datasets: [
      {
        label: `Player: ${highestPassingYards.player_name} (Highest Passing Yards)`,
        data: [
          highestPassingYards.passing_yards,
          highestPassingYards.touchdowns,
          highestPassingYards.interceptions
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  } : null;

  // Prepare the chart data for the highest passing TDs player
  const highestPassingTDsData = highestPassingTDs ? {
    labels: ['Passing Yards', 'Touchdowns', 'Interceptions'],
    datasets: [
      {
        label: `Player: ${highestPassingTDs.player_name} (Highest Passing TDs)`,
        data: [
          highestPassingTDs.passing_yards,
          highestPassingTDs.touchdowns,
          highestPassingTDs.interceptions
        ],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
    ],
  } : null;

  // Prepare the chart data for the average TDs and INTs per week
  const averageTDsINTsData = {
    labels: averageTDsINTs.map((data) => `Week ${data.week}`),
    datasets: [
      {
        label: 'Average Passing TDs per Week',
        data: averageTDsINTs.map((data) => parseFloat(data.average_tds)),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Average INTs per Week',
        data: averageTDsINTs.map((data) => parseFloat(data.average_ints)),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="trend-chart-container">
      <h3>Quarterback Performance Trend</h3>
      <Line data={chartData} />

      {highestPassingEPA && (
        <div className="highest-passing-epa-chart">
          <h3>Highest Passing EPA Player Stats</h3>
          <Bar data={highestPassingEPAData} />
        </div>
      )}

      {highestPassingYards && (
        <div className="highest-passing-yards-chart">
          <h3>Highest Passing Yards Player Stats</h3>
          <Bar data={highestPassingYardsData} />
        </div>
      )}

      {highestPassingTDs && (
        <div className="highest-passing-tds-chart">
          <h3>Highest Passing TDs Player Stats</h3>
          <Bar data={highestPassingTDsData} />
        </div>
      )}

      <div className="average-tds-ints-chart">
        <h3>Average Passing TDs and INTs (Last 4 Weeks)</h3>
        <Line data={averageTDsINTsData} />
      </div>
    </div>
  );
};

export default TrendsChart;
