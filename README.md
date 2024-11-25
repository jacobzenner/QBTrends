# NFL Quarterback Performance Tracker

## Overview
This project is a web application designed to track and visualize the performance of NFL quarterbacks throughout the season. The application uses the PERN stack (PostgreSQL, Express, React, Node.js) and is containerized using Docker. It provides visualizations such as trends in average passing yards, average touchdowns, and interceptions over recent weeks, as well as bar charts highlighting top quarterback performances for specific metrics.

## Features
- **Average Passing Yards Trend**: Displays the average passing yards over the last 4 weeks.
- **Highest Passing EPA, Yards, and TDs**: Shows bar charts for quarterbacks with the highest passing EPA, total passing yards, and touchdowns, along with additional stats.
- **Average Touchdowns and Interceptions Trend**: Visualizes the average passing TDs and INTs over the last 4 weeks using a line chart for better trend analysis.

## Technology Stack
- **Frontend**: React, Chart.js for visualizations
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose

## Project Structure
- **frontend/**: Contains all frontend code (React components, styles, etc.).
  - **components/**: Includes the main components such as `TrendsChart.js` to visualize the quarterback performance.
  - **public/** and **src/** directories as per standard React app structure.
- **backend/**: Contains all backend code (Express routes, database connection).
  - **routes/**: Includes route handlers for fetching quarterback stats.
  - **db.js**: Sets up the PostgreSQL database connection.
- **scripts/**: Contains scripts to populate the database.
  - **qbstats.py**: Script to populate the database with quarterback data. Run this after the container is up.
- **init.sql**: SQL scripts to create tables and functions required for the application.

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/nfl-qb-performance-tracker.git
   cd nfl-qb-performance-tracker
   ```
2. **Run with Docker Compose**:
   Ensure Docker and Docker Compose are installed on your machine. Then, run:
   ```bash
   docker-compose up
   ```
   This will start both the backend and frontend services along with the PostgreSQL database.

3. **Populate the Database**:
   After the containers are up and running, run the `qbstats.py` script to populate the database:
   ```bash
   python scripts/qbstats.py
   ```

4. **Access the Application**:
   Once the services are up, you can access the application at `http://localhost:3000`.

## API Endpoints
- **/api/qb-stats/average-passing-yards**: Returns the average passing yards for all players over the last 4 weeks.
- **/api/qb-stats/highest-passing-epa**: Returns the player with the highest average passing EPA.
- **/api/qb-stats/highest-passing-yards**: Returns the player with the highest total passing yards.
- **/api/qb-stats/highest-passing-tds**: Returns the player with the highest total passing touchdowns.
- **/api/qb-stats/average-tds-ints**: Returns the average passing TDs and INTs per week for the last 4 weeks.

## Requirements
- **Docker** and **Docker Compose**
- **Node.js** (if not running with Docker)
- **PostgreSQL** (if not running with Docker)

## How It Works
- The backend uses Node.js and Express to serve the data by interacting with PostgreSQL functions.
- The frontend uses React and Chart.js to present data visualizations such as bar charts and line charts.
- SQL functions are defined in `init.sql` to provide complex data aggregations, which are then called by the backend to present to the frontend.

