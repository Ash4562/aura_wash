const express = require('express');
const router = express.Router();
// const shopNoteController = require('../controllers/shopNoteController');
const { createNote, getNotesByShop, updateNote, deleteNote } = require('../../controller/shop/ShopNoteController');

// Create note
router.post('/shop-notes', createNote);

// Get all notes for a shop
router.get('/shop-notes/:shopId', getNotesByShop);

// Update a note
router.put('/shop-notes/:noteId', updateNote);

// Delete a note
router.delete('/shop-notes/:noteId', deleteNote);

module.exports = router;
