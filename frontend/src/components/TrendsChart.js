import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend
);

const TrendsChart = () => {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/qb-stats/average-passing-yards`)
      .then(response => response.json())
      .then(data => {
        console.log('Trend data fetched (from backend already sorted):', data);
        setTrendData(data); 
      })
      .catch(error => console.error('Error fetching trend data:', error));
  }, []);

  // Prepare the chart data
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

  return (
    <div className="trend-chart-container">
      <h3>Quarterback Performance Trend</h3>
      <Line data={chartData} />
    </div>
  );
};

export default TrendsChart;
