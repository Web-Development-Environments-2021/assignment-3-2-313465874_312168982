//connected users

var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");


/**
 * Authenticate all incoming requests by middleware
 */
//check if user is connected
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with games properties and save this game in the favorites list of the logged-in user
 */
router.post("/addFavoriteGame", async (req, res, next) => {
  try { 
    const user_id = req.session.user_id;
    const game_id = req.body.game_id;
    resultFav = await users_utils.checkIfGameFavorite(user_id, game_id);
    if(resultFav == -1){
      throw { status: 409, message: "You already like this game"};
    }
    resultPass = await users_utils.checkIfGamePass(game_id);
    if(resultPass == -1){
      throw { status: 403, message: "The game already pass"};
    }

    await users_utils.markGameAsFavorite(user_id, game_id);
    res.status(201).send("The game successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

router.get("/getFavoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    await DButils.execQuery(
      `DELETE favoriteGames FROM favoriteGames JOIN games 
      ON favoriteGames.game_id=games.game_id
      WHERE games.result is not NULL`
    );

    const game_ids = await users_utils.getFavoriteGames(user_id);
    if(game_ids.length == 0){
      throw { status: 404, message: "No favorite games available"};
    }
    
    let favorite_games = [];
    for (let x = 0; x<game_ids.length;x++){
      let gameId = game_ids[x]["game_id"]; 
      favorite_games.push(await DButils.execQuery
      (`select * from games where game_id='${gameId}'`)); //extracting the games ids into array
    }
    res.status(200).send(favorite_games);
    
  } catch (error) {
    next(error);
  }
});

//check if user is manager
router.use(async function (req, res, next) {
  DButils.execQuery("SELECT user_id FROM users")
    .then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id && req.session.user_id == 1)) {
        req.user_id = req.session.user_id;
        next();
      }
      else{
        throw { status: 403, message: "you are not allowed to do this activity"};
      }
    })
    .catch((err) => next(err));
});

//add game by representative of the association
router.post("/addGame", async (req, res, next) => {
  try {
    const referee_id = req.body.referee_id;
    const data_time = req.body.data_time;
    const home_team = req.body.home_team;
    const away_team = req.body.away_team;
    const stadium = req.body.stadium;
  
    await users_utils.addGameToDB(referee_id,data_time,home_team,away_team,stadium);
    res.status(201).send("The game successfully added to DB");
  } catch (error) {
    next(error);
  }
});

router.post("/addResultGame", async (req, res, next) => {
  try {
    const game_id = req.body.game_id;
    const result = req.body.result;
    await users_utils.addResultGame(game_id, result);
    res.status(201).send("The result successfully added to the game");
  } catch (error) {
    next(error);
  }
});

router.post("/addMatchReportToGame", async (req, res, next) => {
  try {
    const game_id = req.body.game_id;
    const minuteEvent = req.body.minuteEvent;
    const event = req.body.event;
    await users_utils.addMatchReportToGame(game_id, minuteEvent, event);
    res.status(201).send("The match report successfully added to the game");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
