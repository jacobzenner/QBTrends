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

CREATE OR REPLACE FUNCTION get_average_passing_yards()
RETURNS TABLE(week INT, average_passing_yards NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT qws.week, AVG(qws.passing_yards) AS average_passing_yards
    FROM qb_weekly_stats qws
    WHERE qws.passing_yards IS NOT NULL
    GROUP BY qws.week
    ORDER BY qws.week DESC
    LIMIT 4;
END;
$$ LANGUAGE plpgsql;

-- Create function to get player with highest average passing EPA
CREATE OR REPLACE FUNCTION get_highest_passing_epa()
RETURNS TABLE(player_id VARCHAR, player_name VARCHAR, team VARCHAR, passing_epa FLOAT, passing_yards INTEGER, touchdowns INTEGER, interceptions INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT qws.player_id, qb.name AS player_name, qb.team, SUM(qws.passing_epa) AS passing_epa, 
           SUM(qws.passing_yards)::INTEGER AS passing_yards, SUM(qws.passing_tds)::INTEGER AS touchdowns, 
           SUM(qws.interceptions)::INTEGER AS interceptions
    FROM qb_weekly_stats qws
    JOIN quarterback qb ON qws.player_id = qb.id
    GROUP BY qws.player_id, qb.name, qb.team
    ORDER BY passing_epa DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to get player with highest total passing yards
CREATE OR REPLACE FUNCTION get_highest_passing_yards()
RETURNS TABLE(player_id VARCHAR, player_name VARCHAR, team VARCHAR, passing_yards INTEGER, touchdowns INTEGER, interceptions INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT qws.player_id, qb.name AS player_name, qb.team, SUM(qws.passing_yards)::INTEGER AS passing_yards, 
           SUM(qws.passing_tds)::INTEGER AS touchdowns, SUM(qws.interceptions)::INTEGER AS interceptions
    FROM qb_weekly_stats qws
    JOIN quarterback qb ON qws.player_id = qb.id
    GROUP BY qws.player_id, qb.name, qb.team
    ORDER BY passing_yards DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to get player with highest total passing TDs
CREATE OR REPLACE FUNCTION get_highest_passing_tds()
RETURNS TABLE(player_id VARCHAR, player_name VARCHAR, team VARCHAR, touchdowns INTEGER, passing_yards INTEGER, interceptions INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT qws.player_id, qb.name AS player_name, qb.team, SUM(qws.passing_tds)::INTEGER AS touchdowns, 
           SUM(qws.passing_yards)::INTEGER AS passing_yards, SUM(qws.interceptions)::INTEGER AS interceptions
    FROM qb_weekly_stats qws
    JOIN quarterback qb ON qws.player_id = qb.id
    GROUP BY qws.player_id, qb.name, qb.team
    ORDER BY touchdowns DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;



-- Create function to get average TDs and INTs over the last 4 weeks
CREATE OR REPLACE FUNCTION get_average_tds_ints()
RETURNS TABLE(week INTEGER, average_tds DOUBLE PRECISION, average_ints DOUBLE PRECISION) AS $$
BEGIN
    RETURN QUERY
    SELECT qws.week, 
           AVG(qws.passing_tds)::DOUBLE PRECISION AS average_tds, 
           AVG(qws.interceptions)::DOUBLE PRECISION AS average_ints
    FROM qb_weekly_stats qws
    WHERE qws.week IN (
        SELECT DISTINCT qws_inner.week
        FROM qb_weekly_stats qws_inner
        ORDER BY qws_inner.week DESC
        LIMIT 4
    )
    GROUP BY qws.week
    ORDER BY qws.week ASC;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION clean_qb_stats()
RETURNS VOID AS $$
BEGIN
    DELETE FROM qb_weekly_stats WHERE passing_yards < 50 OR attempts < 10;
END;
$$ LANGUAGE plpgsql;
