-- CREATE TABLE games(
-- 	[game_id] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
-- 	[referee_id] [int] NOT NULL,
-- 	[date_time] [datetime] NOT NULL DEFAULT GetDate(),
-- 	[home_team] [varchar](30) NOT NULL,
-- 	[away_team] [varchar](30) NOT NULL,
-- 	[stadium] [varchar](30)  NOT NULL,
-- 	[result] [varchar](30),
-- 	FOREIGN KEY (referee_id) REFERENCES referees(referee_id)
-- )
CREATE TABLE games(
	[game_id] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[referee_name] [varchar](30) NOT NULL,
	[date_time] [datetime] NOT NULL DEFAULT GetDate(),
	[home_team] [varchar](30) NOT NULL,
	[away_team] [varchar](30) NOT NULL,
	[stadium] [varchar](30)  NOT NULL,
	[result] [varchar](30)
)
