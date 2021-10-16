const Message = require('../models/messageModel');

exports.home_page = function(req, res, next) {
  Message.find()
         .lean()
         .sort([['createdAt', 'descending']])
         .exec(function(err, messages_list) {
           if (err) return next(err);
           res.render('index', {messages: messages_list});
         });
};
