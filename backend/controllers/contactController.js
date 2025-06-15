// backend/controllers/contactController.js
import Message from '../models/Message.js';
import asyncHandler from 'express-async-handler';

// This function allows users to submit messages
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required');
  }
  const createdMessage = await Message.create({ name, email, subject, message });
  res.status(201).json({
    message: 'Message received successfully!',
    data: createdMessage,
  });
});

// --- THIS IS THE NEW FUNCTION TO DELETE A MESSAGE ---
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (message) {
    await Message.deleteOne({ _id: req.params.id });
    res.json({ message: 'Message removed successfully' });
  } else {
    res.status(404);
    throw new Error('Message not found');
  }
});

// Make sure both functions are exported
export { submitContactForm, deleteMessage };