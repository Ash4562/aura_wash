// const ShopNote = require('../models/shopNote');

const ShopNote = require("../../models/shop/ShopNote");

// CREATE note
exports.createNote = async (req, res) => {
  const { shopId, title, content } = req.body;

  if (!shopId || !title || !content) {
    return res.status(400).json({ error: 'shopId, title and content are required' });
  }

  try {
    const note = await ShopNote.create({ shopId, title: title.trim(), content: content.trim() });
    res.status(201).json({ message: 'Note created successfully', note });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// GET all notes for a shop
exports.getNotesByShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    const notes = await ShopNote.find({ shopId }).sort({ createdAt: -1 });
    res.status(200).json({ notes });
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// UPDATE note
exports.updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  try {
    const note = await ShopNote.findById(noteId);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    if (title) note.title = title.trim();
    if (content) note.content = content.trim();

    await note.save();
    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// DELETE note
exports.deleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const deleted = await ShopNote.findByIdAndDelete(noteId);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
