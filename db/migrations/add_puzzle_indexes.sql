-- Add performance indexes for puzzle queries
-- This will dramatically speed up daily puzzle lookups

-- Composite index for type + publishDate (most common query)
CREATE INDEX IF NOT EXISTS puzzles_type_date_idx ON puzzles(type, publish_date);

-- Index on publishDate alone for date-based queries
CREATE INDEX IF NOT EXISTS puzzles_publish_date_idx ON puzzles(publish_date);

-- Indexes for game scores
CREATE INDEX IF NOT EXISTS game_scores_game_type_idx ON game_scores(game_type);
CREATE INDEX IF NOT EXISTS game_scores_user_id_idx ON game_scores(user_id);

-- Analyze tables to update statistics
ANALYZE puzzles;
ANALYZE game_scores;
