const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

//team preview
async function getTeamInfo(team_id) {
    let promises = [];
    promises.push(
      axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
          api_token: process.env.api_token,
        },
      })
    )
    let team_info = await Promise.all(promises);
    return this.extractRelevantTeamData(team_info.data.data);
}
  
function extractRelevantTeamData(team_info) {
    return team_info.map((team_info) => {  
    const { id,name, logo_path} = team_info;
      return {
        name: name,
        logo: logo_path,
        id: id
      };
    })
  }

  //full details team
  async function getGamesInTeam(team_name) {
    
    let futureGames = await DButils.execQuery(
      `SELECT * FROM games WHERE result is NULL AND home_team='${team_name}' OR away_team='${team_name}'`
    );
    let pastGames = await DButils.execQuery(
      `SELECT * FROM games WHERE result is not NULL AND home_team='${team_name}' OR away_team='${team_name}'`
    );
    let matchReportDict = {}
    for (let x = 0; x< pastGames.length;x++){
      let gameId = pastGames[x]["game_id"]; 
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

  exports.getGamesInTeam = getGamesInTeam;
  exports.getTeamInfo = getTeamInfo;
  exports.extractRelevantTeamData = extractRelevantTeamData;
  