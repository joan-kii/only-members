const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = mongoose.model('Message', new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default:Date.now(), required: true },
  author: { type: String, required: true }
}));

module.exports = Message;
