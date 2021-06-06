CREATE TABLE favoriteGames(
	[user_id] [int] NOT NULL,
	[game_id] [int] NOT NULL,
	primary key(game_id,user_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	FOREIGN KEY (game_id) REFERENCES games(game_id)
) 