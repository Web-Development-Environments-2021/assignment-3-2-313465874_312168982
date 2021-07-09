const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271;

async function getLeagueDetails() { 
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  // const stage = await axios.get(
  //   `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
  //   {
  //     params: {
  //       api_token: process.env.api_token,
  //     },
  //   }
  // ); 
  // next game details should come from DB
  const nextGame = await DButils.execQuery(
    `SELECT TOP 1 games.*
    FROM games
    WHERE result is NULL 
    ORDER BY date_time ASC`
  );

  let top3games = await DButils.execQuery(
    `SELECT TOP 3 games.*
    FROM games, favoriteGames
    WHERE games.game_id = favoriteGames.game_id AND result is NULL 
    ORDER BY date_time ASC`
  );
  if(top3games.length == 0){
    top3games = "There is no future favorite games";
  }
  //check if nextGame is empty????????????????????????????????????????
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    // current_stage_name: stage.data.data.name,
    nextGame: nextGame,
  };
}

async function getGamesDB() {
  let futureGames = await DButils.execQuery(
    `SELECT * FROM games WHERE result is NULL`
  );
  let pastGames = await DButils.execQuery(
      `SELECT * FROM games WHERE result is not NULL`
  );
  let matchReportDict = {}
  for (let x = 0; x< pastGames.length;x++){
    let gameId = pastGames[x]["game_id"];  
    //pastGamesDict[gameId] = [];
    let matchReportGame = await DButils.execQuery(
      `SELECT matchReport.minuteEvent,gameEvent.event 
      FROM matchReport JOIN gameEvent
      ON matchReport.event = gameEvent.event_id AND matchReport.game_id = ${gameId}`
    );
    matchReportDict[gameId]=matchReportGame
    
  }
  if(futureGames.length == 0){
    future_games = "No future games available"
  }
  if(pastGames.length == 0){
    pastGames = "No past games available"
  }
  if(Object.keys(matchReportDict).length == 0){
    matchReportDict = "No past games available"
  }
  return {
    future_games: futureGames,
    past_games: pastGames,
    match_reports_dict: matchReportDict,
  };
}

exports.getLeagueDetails = getLeagueDetails;
exports.getGamesDB = getGamesDB;
