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


CREATE OR REPLACE FUNCTION get_top_performers(season INT, stat TEXT)
RETURNS TABLE(player_name TEXT, team TEXT, stat_value NUMERIC) AS $$
BEGIN
    RETURN QUERY EXECUTE format('
        SELECT qb.name, qb.team, qws.%I
        FROM quarterback qb
        JOIN qb_weekly_stats qws ON qb.id = qws.player_id
        WHERE qws.season = $1
        ORDER BY qws.%I DESC
        LIMIT 10', stat, stat) USING season;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_moving_avg_stat(player_id TEXT, stat TEXT)
RETURNS TABLE(week INT, moving_avg NUMERIC) AS $$
BEGIN
    RETURN QUERY EXECUTE format('
        SELECT week, AVG(%I) OVER (ORDER BY week ROWS BETWEEN 4 PRECEDING AND CURRENT ROW)
        FROM qb_weekly_stats
        WHERE player_id = $1', stat) USING player_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION clean_qb_stats()
RETURNS VOID AS $$
BEGIN
    DELETE FROM qb_weekly_stats WHERE passing_yards < 50 OR attempts < 10;
END;
$$ LANGUAGE plpgsql;
