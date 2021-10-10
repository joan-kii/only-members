const express = require('express');
const router = express.Router();

const home_controller = require('../controllers/homeController');
const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');

// Home page

router.get('/', home_controller.home_page);

// Create User

router.get('/signup', user_controller.user_create_get);
router.post('/signup', user_controller.user_create_post);

// Create Message

router.get('/message', message_controller.message_create_get);
router.post('/message', message_controller.message_create_post);

module.exports = router;
