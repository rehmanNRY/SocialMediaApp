// savedItem.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import { toggleItemInSaves, getAllSaves } from '../controllers/saves.controllers.js';

const router = express.Router();

// Route to toggle an item in saves (add or remove)
router.post('/toggle', fetchUser, toggleItemInSaves);

// Route to get all saved items of the logged-in user
router.get('/all', fetchUser, getAllSaves);

export default router;