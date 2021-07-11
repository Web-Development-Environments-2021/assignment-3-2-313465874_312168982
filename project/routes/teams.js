var express = require("express");
var router = express.Router();
// const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
 
//get team preview details 
router.get("/teamDetails/:teamId", async (req, res, next) => {
  let team_details = [];
  try {
    team_details.push(await teams_utils.getTeamInfo(
      req.params.teamId
    ));
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});


//get team full details 
router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_details = [];
  try { 
    team_details.push(await players_utils.getPlayersByTeam(
      req.params.teamId
    ));
    //we should keep implementing team page.....
    let team_name = team_details[0][1]["team_name"];
    // let team_name = "Celtic"
    team_details.push(await teams_utils.getGamesInTeam(team_name))
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

//players preview details
router.get("/playersPreviewDetails/:users_id", async (req, res, next) => {
  try{
    const players_preview_details = await players_utils.getPlayersInfo(
      req.params.users_id
    );
    if(players_preview_details.length == 0){
      res.status(404).send({message: "No results available"})
    }
    else{
      res.status(200).send({message: "succeed",data:players_preview_details})
    }
  } catch(error){
    next(error);
  }
})

//players full details
router.get("/playersFullDetails/:users_id", async (req, res, next) => {
  try{
    const players_full_details = await players_utils.getPlayersFullInfo(
      req.params.users_id
    );
    if(players_full_details.length == 0){
      res.status(404).send({message: "No results available"})
    }
    else{
      res.status(200).send({message: "succeed",data:players_full_details})
    }
  } catch(error){
    next(error);
  }
})


module.exports = router;
