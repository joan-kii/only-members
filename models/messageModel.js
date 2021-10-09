const mongoose = require('mongoose');

const Message = mongoose.model('Message', new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date.now() },
  author: { type: Schema.Types.ObjectId },
  ref: 'User'
}));

module.exports = Message;
