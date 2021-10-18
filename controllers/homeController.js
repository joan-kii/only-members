const Message = require('../models/messageModel');

exports.home_page = async function(req, res, next) {
  try {
    const getMessages = await Message.find()
         .lean()
         .sort([['createdAt', 'descending']])
    res.render('index', {messages: getMessages});
  } catch (err) {
     return next(err);;
  }
};
