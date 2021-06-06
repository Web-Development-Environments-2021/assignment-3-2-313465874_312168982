CREATE TABLE users(
	[user_id] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[username] [varchar](30) NOT NULL UNIQUE,
	[firstName] [varchar](30) NOT NULL,
	[lastName] [varchar](30) NOT NULL,
	[country] [varchar](30) NOT NULL,
	[password] [varchar](300) NOT NULL,
	[email] [varchar](300) NOT NULL,
	[imageUrl] [varchar](300) NOT NULL
)


