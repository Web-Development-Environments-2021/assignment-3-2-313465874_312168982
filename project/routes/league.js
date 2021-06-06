var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

//search
router.get("/search", async (req, res, next) => {
  try{
    const query = req.query["query"];
    const res_players_search = await axios.get(`${api_domain}/players/search/:${query}`, {
      params: {
        api_token: process.env.api_token,
        include: "team",
        PLAYER_NAME: query
      }
    });
    const res_teams_search = await axios.get(`${api_domain}/teams/search/${query}`, {
      params: {
        api_token: process.env.api_token,
        TEAM_NAME: query
      }
    });
    let playersSearch = [];
    let teamsSearch = [];
    if(res_players_search.data.data.length == 0 && res_teams_search.data.data.length == 0){
      res.status(404).send({message: "No results available"})
    }
    else{
      if(res_players_search.data.data.length != 0){
        if(res_players_search.data.data.length == 1){
          playersSearch = await (
            players_utils.getPlayersInfo(res_players_search.data.data[0]["player_id"]));
        }
        else{
          playersSearch = await Promise.all(res_players_search.data.data.map(
            (player)=>players_utils.getPlayersInfo(player["player_id"])));
        }
      }
      if(res_teams_search.data.data.length != 0){
        if(res_teams_search.data.data.length == 1){
          teamsSearch = await (
            teams_utils.getTeamInfo(res_teams_search.data.data[0]["id"]));
        }
        else{
          teamsSearch = await Promise.all(res_teams_search.data.data.map(
            (team)=>teams_utils.getTeamInfo(team["id"])));
        }
      }
      res.status(200).send({message: "succeed",data: playersSearch, teamsSearch})
    }
  } catch (error) {
    next(error);
  }
})

router.get("/getGamesDB", async (req, res, next) => {
  try {
    const gamesDB = await league_utils.getGamesDB();
    res.send(gamesDB);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
