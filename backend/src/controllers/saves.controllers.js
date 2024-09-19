// savedItem.controller.js
import { SavedItem } from '../models/saves.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Controller to toggle an item in saves (add or remove)
export const toggleItemInSaves = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // Retrieved from the fetchUser middleware
    const { post } = req.body;

    // Check if the post is already saved by the user
    const existingSave = await SavedItem.findOne({ user: userId, post });

    if (existingSave) {
        // Remove the saved item if it exists
        await SavedItem.findOneAndDelete({ user: userId, post });
        return res.status(200).json(new ApiResponse(200, 'Item removed from saves successfully'));
    }

    // Add the item to saves if it doesn't exist
    const savedItem = await SavedItem.create({ user: userId, post });
    res.status(201).json(new ApiResponse(201, 'Item saved successfully', savedItem));
});

// Controller to get all saved items of the logged-in user
export const getAllSaves = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // Retrieved from the fetchUser middleware

    // Fetch all saved items of the user and populate the post and user details
    const savedItems = await SavedItem.find({ user: userId })
        .populate({
            path: 'post',
            populate: {
                path: 'user',  // Populate the user field within each post
                select: 'fullName profilePicture username',  // Select the necessary fields
            }
        });

    res.status(200).json(new ApiResponse(200, 'Saved items fetched successfully', savedItems));
});
