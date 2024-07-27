const GameInstance = require("../models/gameinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.gameinstance_detail = asyncHandler(async (req, res, next) => {
  console.log("in here");
  const gameInstance = await GameInstance.findById(req.params.id)
    .populate("game")
    .exec();

  res.render("gameinstance_detail", {
    title: "Game Instance Detail",
    game_instance: gameInstance,
  });
});

exports.gameinstance_list = asyncHandler(async (req, res, next) => {
  const allGameInstances = await GameInstance.find().populate("game").exec();

  res.render("gameinstance_list", {
    title: "Game Instance List",
    gameinstance_list: allGameInstances,
  });
});
