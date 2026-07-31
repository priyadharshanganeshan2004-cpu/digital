const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getConversations,
    getMessages,
    sendMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getConversations)
    .post(sendMessage);

router.get('/:userId', getMessages);

module.exports = router;
