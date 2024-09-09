// savedItem.controller.js
import { SavedItem } from '../models/saves.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Controller to add an item to saves
export const addItemToSaves = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // Retrieved from the fetchUser middleware
    const { post } = req.body;

    // Check if the post is already saved by the user
    const existingSave = await SavedItem.findOne({ user: userId, post });
    if (existingSave) {
        return next(new ApiError(400, 'This post is already saved'));
    }

    // Create a new saved item
    const savedItem = await SavedItem.create({ user: userId, post });

    res.status(201).json(new ApiResponse(201, 'Item saved successfully', savedItem));
});

// Controller to remove an item from saves
export const removeItemFromSaves = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // Retrieved from the fetchUser middleware
    const { post } = req.body;

    // Find and delete the saved item
    const savedItem = await SavedItem.findOneAndDelete({ user: userId, post });

    if (!savedItem) {
        return next(new ApiError(404, 'Saved item not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Item removed from saves successfully'));
});

// Controller to get all saved items of the logged-in user
export const getAllSaves = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // Retrieved from the fetchUser middleware

    // Fetch all saved items of the user
    const savedItems = await SavedItem.find({ user: userId }).populate('post');

    res.status(200).json(new ApiResponse(200, 'Saved items fetched successfully', savedItems));
});
