const express = require('express');
const router = express.Router();

const game_controller = require('../controllers/gameController');
const gameinstance_controller = require('../controllers/gameInstanceController');
const genre_controller = require('../controllers/genreController');

router.get('/', game_controller.index);
router.get('/games', game_controller.game_list);
router.get('/game/:id', game_controller.game_detail);
router.get('/gameinstance/:id', gameinstance_controller.gameinstance_detail);
router.get('/gameinstances', gameinstance_controller.gameinstance_list);
router.get('/genres', genre_controller.genre_list);
router.get('/genre/create', genre_controller.genre_create_get);
router.get('/genre/:id', genre_controller.genre_detail);
router.get('/genre/:id/delete', genre_controller.genre_delete_get);
router.get('/genre/:id/update', genre_controller.genre_update_get);

router.post('/genre/create', genre_controller.genre_create_post);
router.post('/genre/:id/delete', genre_controller.genre_delete_post);
router.post('/genre/:id/update', genre_controller.genre_update_post);
module.exports = router;
