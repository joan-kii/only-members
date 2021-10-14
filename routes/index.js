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

// Log In User

router.get('/login', user_controller.user_login_get);
router.post('/login', user_controller.user_login_post);

// Log Out User

router.get('/logout', user_controller.user_logout_get);

// Membership

router.get('/membership', user_controller.user_membership_get);
router.post('/membership', user_controller.user_membership_post);

// Create Message

router.get('/message', message_controller.message_create_get);
router.post('/message', message_controller.message_create_post);

// Delete Message

router.post('/', message_controller.message_delete_post);

module.exports = router;
