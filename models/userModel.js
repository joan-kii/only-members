const mongoose = require('mongoose');

const User = mongoose.model('User', new Schema({
  firstName: { type: String, required: true },  
  lastName: { type: String, required: true },
  userName: { type: String, required: true },
  status: { type: Boolean, required: true },  
  password: { type: String, required: true }  
}));

module.exports = User;
