CREATE TABLE matchReport(
	[mr_id] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[game_id] [int] NOT NULL,
	[minuteEvent] [int] NOT NULL,
	[event] [int] NOT NULL,
	FOREIGN KEY (event) references gameEvent (event_id)
)