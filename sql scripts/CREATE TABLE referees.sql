CREATE TABLE referees(
	[referee_id] [int] UNIQUE NOT NULL,
	[training] [int] NOT NULL,
	FOREIGN KEY (referee_id) REFERENCES users(user_id)
)