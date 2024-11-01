-- Create quarterback table
CREATE TABLE IF NOT EXISTS quarterback (
    id VARCHAR(50) PRIMARY KEY, -- ID is now VARCHAR instead of UUID
    name VARCHAR(255) NOT NULL, -- Full name of the quarterback
    team VARCHAR(50)            -- Team associated with the quarterback
);

-- Weekly statistics for quarterbacks
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

-- Create indexes for fast querying
CREATE INDEX idx_qb_season_week ON qb_weekly_stats (season, week);
CREATE INDEX idx_qb_player_id ON qb_weekly_stats (player_id);

-- Stored procedure to generate QB performance report
CREATE OR REPLACE FUNCTION generate_qb_performance_report(player_id VARCHAR, season INT)
RETURNS TABLE (
    player_name VARCHAR,
    total_passing_yards INT,
    total_touchdowns INT,
    total_interceptions INT,
    total_sacks INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT q.name AS player_name,
           SUM(qw.passing_yards) AS total_passing_yards,
           SUM(qw.passing_tds) AS total_touchdowns,
           SUM(qw.interceptions) AS total_interceptions,
           SUM(qw.sacks) AS total_sacks
    FROM qb_weekly_stats qw
    JOIN quarterback q ON qw.player_id = q.id
    WHERE qw.player_id = player_id AND qw.season = season
    GROUP BY player_name;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to analyze weekly trends for a QB
CREATE OR REPLACE FUNCTION qb_weekly_trends(player_id VARCHAR, season INT)
RETURNS TABLE (
    week INT,
    passing_yards INT,
    passing_tds INT,
    interceptions INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT week, passing_yards, passing_tds, interceptions
    FROM qb_weekly_stats
    WHERE player_id = player_id AND season = season
    ORDER BY week;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to clean invalid data
CREATE OR REPLACE FUNCTION clean_qb_stats()
RETURNS VOID AS $$
BEGIN
    DELETE FROM qb_weekly_stats WHERE passing_yards < 0 OR passing_tds < 0;
END;
$$ LANGUAGE plpgsql;
