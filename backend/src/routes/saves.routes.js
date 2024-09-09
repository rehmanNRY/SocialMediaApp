// savedItem.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import { addItemToSaves, removeItemFromSaves, getAllSaves } from '../controllers/saves.controllers.js';

const router = express.Router();

// Route to add an item to saves
router.post('/add', fetchUser, addItemToSaves);

// Route to remove an item from saves
router.post('/remove', fetchUser, removeItemFromSaves);

// Route to get all saved items of the logged-in user
router.get('/all', fetchUser, getAllSaves);

export default router;
