#! /usr/bin/env node

console.log(
  'This script populates some test games, game instances, and genres to the database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require('./models/game');
const GameInstance = require('./models/gameinstance');
const Genre = require('./models/genre');

const games = [];
const gameinstances = [];
const genres = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createGenres();
  await createGames();
  await createGameInstances();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function createGenres() {
  console.log('Adding genres');
  await Promise.all([
    genreCreate(0, 'Fantasy'),
    genreCreate(1, 'Science Fiction'),
    genreCreate(2, 'Action'),
  ]);
}
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function createGames() {
  console.log('Adding games');
  await Promise.all([
    gameCreate(0, 'God of War', 'Legandary action game', [genres[0], genres[2]], 99.99),
    gameCreate(1, 'Starfield', 'New space exploration game', [genres[1]], 39.99),
    gameCreate(2, 'Streets of Rage', "Side scrolling beat 'em up", [genres[2]], 29.99),
  ]);
}
async function gameCreate(index, title, description, genre, price) {
  const gamedetail = {
    title: title,
    description: description,
    price: price,
  };
  if (genre != false) gamedetail.genre = genre;

  const game = new Game(gamedetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

async function createGameInstances() {
  console.log('Adding Game Instances');
  await Promise.all([
    gameInstanceCreate(0, games[0], 'Used'),
    gameInstanceCreate(1, games[1], 'New'),
    gameInstanceCreate(2, games[2], 'New'),
  ]);
}

async function gameInstanceCreate(index, game, condition) {
  const gameInstanceDetails = {
    game: game,
    condition: condition,
  };

  const gameInstance = new GameInstance(gameInstanceDetails);
  await gameInstance.save();
  gameinstances[index] = gameInstance;
  console.log(`Added game instance: ${game.title}`);
}
