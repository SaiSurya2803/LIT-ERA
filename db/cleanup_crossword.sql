-- Database Cleanup Script: Remove Crossword Data
-- Run this to clean up old crossword puzzles and scores

-- ============================================
-- BACKUP FIRST (Optional but Recommended)
-- ============================================
-- CREATE TABLE puzzles_backup AS SELECT * FROM puzzles WHERE type = 'crossword';
-- CREATE TABLE game_scores_backup AS SELECT * FROM game_scores WHERE game_type = 'crossword';

-- ============================================
-- VIEW OLD DATA (Check before deleting)
-- ============================================

-- View all crossword puzzles
SELECT id, type, publish_date, created_at 
FROM puzzles 
WHERE type = 'crossword'
ORDER BY publish_date DESC;

-- View all crossword scores
SELECT id, user_id, game_type, score, completion_time, completed_date
FROM game_scores 
WHERE game_type = 'crossword'
ORDER BY completed_date DESC;

-- Count of records to be deleted
SELECT 
  (SELECT COUNT(*) FROM puzzles WHERE type = 'crossword') as crossword_puzzles,
  (SELECT COUNT(*) FROM game_scores WHERE game_type = 'crossword') as crossword_scores;

-- ============================================
-- DELETE OLD CROSSWORD DATA
-- ============================================

-- Delete crossword scores
DELETE FROM game_scores WHERE game_type = 'crossword';

-- Delete crossword puzzles
DELETE FROM puzzles WHERE type = 'crossword';

-- ============================================
-- VERIFY CLEANUP
-- ============================================

-- Should return 0 rows
SELECT COUNT(*) as remaining_crossword_puzzles FROM puzzles WHERE type = 'crossword';
SELECT COUNT(*) as remaining_crossword_scores FROM game_scores WHERE game_type = 'crossword';

-- View remaining game types
SELECT DISTINCT type FROM puzzles;
SELECT DISTINCT game_type FROM game_scores;

-- ============================================
-- VACUUM (Optional - Reclaim disk space)
-- ============================================
-- VACUUM ANALYZE puzzles;
-- VACUUM ANALYZE game_scores;
