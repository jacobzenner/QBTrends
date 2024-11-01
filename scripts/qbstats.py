import nfl_data_py as nfl
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# Define the columns for quarterback data
qb_columns = [
    'player_id', 'player_name', 'position', 'recent_team', 'season', 'week',
    'completions', 'attempts', 'passing_yards', 'passing_tds', 'interceptions',
    'sacks', 'passing_air_yards', 'passing_yards_after_catch', 
    'passing_first_downs', 'passing_epa', 'passing_2pt_conversions', 
    'fantasy_points', 'fantasy_points_ppr'
]

# Fetch weekly QB data for the 2024 season
qb_data = nfl.import_weekly_data([2024], qb_columns, downcast=True)
qb_data_filtered = qb_data[qb_data['position'] == 'QB']  # Filter for QBs only

# Database connection parameters
DB_HOST = "localhost"
DB_NAME = "quarterback_stats"
DB_USER = "admin"
DB_PASSWORD = "admin"

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=DB_HOST,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)
cursor = conn.cursor()

# 1. Insert unique quarterbacks into the quarterback table
# Now only need unique player_id, player_name, and recent_team for this table
unique_qbs = qb_data_filtered[['player_id', 'player_name', 'recent_team']].drop_duplicates()

create_qb_table_query = '''
CREATE TABLE IF NOT EXISTS quarterback (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    team VARCHAR(50)
);
'''
cursor.execute(create_qb_table_query)

qb_insert_query = '''
INSERT INTO quarterback (id, name, team)
VALUES %s ON CONFLICT (id) DO NOTHING
'''
# Prepare data for insertion
qb_data_to_insert = [
    (row['player_id'], row['player_name'], row['recent_team'])
    for _, row in unique_qbs.iterrows()
]
execute_values(cursor, qb_insert_query, qb_data_to_insert)
conn.commit()

# 2. Create the qb_weekly_stats table and insert data
# Removed references to team and name in this table, only references player_id
create_stats_table_query = '''
CREATE TABLE IF NOT EXISTS qb_weekly_stats (
    player_id VARCHAR(50) REFERENCES quarterback(id),
    season INT NOT NULL,
    week INT NOT NULL,
    completions INT,
    attempts INT,
    passing_yards INT,
    passing_tds INT,
    interceptions INT,
    sacks INT,
    passing_air_yards INT,
    passing_yards_after_catch INT,
    passing_first_downs INT,
    passing_epa FLOAT,
    passing_2pt_conversions INT,
    fantasy_points FLOAT,
    fantasy_points_ppr FLOAT,
    PRIMARY KEY (player_id, season, week)
);
'''
cursor.execute(create_stats_table_query)
conn.commit()

# Prepare data for insertion into qb_weekly_stats
stats_insert_query = '''
INSERT INTO qb_weekly_stats (
    player_id, season, week, completions, attempts, passing_yards,
    passing_tds, interceptions, sacks, passing_air_yards,
    passing_yards_after_catch, passing_first_downs, passing_epa,
    passing_2pt_conversions, fantasy_points, fantasy_points_ppr
) VALUES %s ON CONFLICT (player_id, season, week) DO NOTHING
'''
# Exclude columns not in qb_weekly_stats (like player_name, recent_team)
stats_data_to_insert = [
    tuple(row[col] for col in [
        'player_id', 'season', 'week', 'completions', 'attempts', 'passing_yards', 
        'passing_tds', 'interceptions', 'sacks', 'passing_air_yards',
        'passing_yards_after_catch', 'passing_first_downs', 'passing_epa', 
        'passing_2pt_conversions', 'fantasy_points', 'fantasy_points_ppr'
    ]) for _, row in qb_data_filtered.iterrows()
]
execute_values(cursor, stats_insert_query, stats_data_to_insert)
conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

print("Data inserted successfully into quarterback and qb_weekly_stats tables.")
