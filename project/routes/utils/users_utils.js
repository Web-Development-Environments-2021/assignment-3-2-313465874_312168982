const DButils = require("./DButils");


async function checkIfGameFavorite(user_id, game_id) {
  const favoriteGame = await DButils.execQuery(
    `SELECT * FROM favoriteGames where user_id = '${user_id}' and game_id = '${game_id}'`
  );
  if (favoriteGame.length != 0){
    return -1;
  }
  return 1;
}

async function checkIfGamePass(game_id) {
  const result = await DButils.execQuery(
    `SELECT result FROM games where game_id = '${game_id}'`
  );
  if(result[0]["result"] != null){
    return -1
  }
  return 1;
}

async function markGameAsFavorite(user_id, game_id) {
  await DButils.execQuery(
    `insert into favoriteGames values ('${user_id}','${game_id}')`
  );
}

async function getFavoriteGames(user_id) {
  const game_ids = await DButils.execQuery(
    `SELECT game_id from favoriteGames WHERE user_id='${user_id}'`
  );
  return game_ids; 
}

async function addGameToDB(referee_id,date_time,home_team,away_team,stadium) {
  await DButils.execQuery(
    `insert into games (referee_id,date_time,home_team,away_team,stadium) 
    values ('${referee_id}','${date_time}','${home_team}','${away_team}','${stadium}')`
  );
}

async function addResultGame(game_id, result){
  await DButils.execQuery(
    `UPDATE games
    SET result = ('${result}')
    WHERE game_id ='${game_id}'`
  );
}

async function addMatchReportToGame(game_id, minuteEvent, event){
  await DButils.execQuery(
    `INSERT INTO matchReport (game_id, minuteEvent, event) 
    values ('${game_id}','${minuteEvent}','${event}')`
  );
}

exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;
exports.checkIfGameFavorite = checkIfGameFavorite;
exports.checkIfGamePass = checkIfGamePass;
exports.addGameToDB = addGameToDB;
exports.addResultGame = addResultGame;
exports.addMatchReportToGame = addMatchReportToGame;