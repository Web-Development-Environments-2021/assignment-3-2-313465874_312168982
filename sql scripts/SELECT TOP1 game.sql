SELECT TOP 1 games.game_id, favoriteGames.game_id
FROM games, favoriteGames
WHERE games.game_id = favoriteGames.game_id AND result=NULL 
ORDER BY date_time ASC