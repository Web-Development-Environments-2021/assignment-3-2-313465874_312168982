const axios = require("axios");
// require("dotenv").config();
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

//player preview
async function getPlayersInfo(players_ids_list) {
  let promises = [];
  if(Array.isArray(players_ids_list)){ 
    players_ids_list.map((id) =>
      promises.push(
        axios.get(`${api_domain}/players/${id}`, {
          params: {
            api_token: process.env.api_token,
            include: "team",
          },
        })
      )
    );
  }
  else{
      promises.push(
        axios.get(`${api_domain}/players/${players_ids_list}`, {
          params: {
            api_token: process.env.api_token,
            include: "team",
          },
        })
      )
  }
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

function extractRelevantPlayerData(players_info) {
    return players_info.map((player_info) => {
      const { fullname, image_path, position_id,player_id } = player_info;
      const { name } = player_info.team.data;
      return {
        name: fullname,
        image: image_path,
        position: position_id,
        team_name: name,
        player_id:player_id
      };
    });
}

//full details player
async function getPlayersFullInfo(players_ids_list) {
  let promises = [];
  if(Array.isArray(players_ids_list)){
    players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  }
  else{
    promises.push(
      axios.get(`${api_domain}/players/${players_ids_list}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  }
  
  let players_info = await Promise.all(promises);
  return this.extractFullPlayerData(players_info);
}

function extractFullPlayerData(players_info) {
  return players_info.map((player_info) => {
    if(player_info.data.data){
      player_info=player_info.data.data
    }
    const { fullname, common_name, birthdate, countryBirth, weight, height, image_path, nationality, position_id } = player_info;
    const { name } = player_info.team.data;
    return {
      name: fullname,
      common_name: common_name,
      birthDate: birthdate,
      countryBirth: countryBirth,
      weight: weight,
      height: height,
      image: image_path,
      nation: nationality,
      position: position_id,
      team_name: name,
    };
  });
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.extractFullPlayerData = extractFullPlayerData;
exports.getPlayersFullInfo = getPlayersFullInfo;
exports.extractRelevantPlayerData = extractRelevantPlayerData;