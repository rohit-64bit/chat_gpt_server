const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const ResponseHandler = require('../services/res_handler');
const ChatModel = require('../models/chat.model');
const ProjectModel = require('../models/project.model');
const MessageModel = require('../models/message.model');

router.get('/', authMiddleware, async (req, res) => {

    try {

        const chats = await ChatModel.find({
            userID: req.user._id,
            markedDeleted: false
        })

        ResponseHandler.sendSuccess(res, chats, 200);

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

router.put('/:id', authMiddleware, async (req, res) => {

    try {

        const { id } = req.params

        const { title } = req.body

        const updatedChat = await ChatModel.findByIdAndUpdate(id, { title }, { new: true })

        ResponseHandler.sendSuccess(res, updatedChat, 200);

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

router.delete('/:id', authMiddleware, async (req, res) => {

    try {

        const { id } = req.params

        const deletedChat = await ChatModel.findByIdAndUpdate(id, { markedDeleted: true }, { new: true })

        ResponseHandler.sendSuccess(res, deletedChat, 200);

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

router.post('/:flag/:projectID', authMiddleware, async (req, res) => {

    try {

        const { flag } = req.params;

        const { message } = req.body;

        const aireply = {
            reply: "This is a sample reply from the AI",
            title: "Sample Chat Title",
            context: "This is a sample context for the chat"
        }

        let project = null;
        let newReply = null;

        if (req.params.projectID !== 'null') {
            project = await ProjectModel.findOne({
                _id: req.params.projectID,
                userID: req.user._id,
                markedDeleted: false
            })
        }

        if (flag === 'new') {

            const initialChat = await ChatModel.create({
                userID: req.user._id
            })

            const newMessage = await MessageModel.create({
                userID: req.user._id,
                chatID: initialChat._id,
                message,
                agent: 'user'
            })

            // TODO: Integrate ai here to handle new chat which will return the reply for the message a short hat context and a title for the chat

            const aireply = await processMessage({
                chatType: 'new',
                message,
                context: '',
                projectContext: project ? project.context : 'N/A'
            })

            newReply = await MessageModel.create({
                userID: req.user._id,
                chatID: initialChat._id,
                message: aireply.reply,
                agent: 'bot'
            })

            initialChat.title = aireply.title
            initialChat.context = aireply.context

            if (project) {

                initialChat.projectID = project._id

                project.context = aireply.projectContext

                await project.save()

            }

            await initialChat.save()

        } else {

            const existingChat = await ChatModel.findOne({
                userID: req.user._id,
                markedDeleted: false
            }).sort({ createdAt: -1 })

            if (!existingChat) {
                return ResponseHandler.sendError(res, "No existing chat found", 404);
            }

            const newMessage = await MessageModel.create({
                userID: req.user._id,
                chatID: existingChat._id,
                message,
                agent: 'user'
            })

            // TODO: ai input will be chat context and message with output of reply and updated context

            const aireply = await processMessage({
                chatType: 'existing',
                message,
                context: existingChat.context,
                projectContext: project ? project.context : 'N/A'
            })

            newReply = await MessageModel.create({
                userID: req.user._id,
                chatID: existingChat._id,
                message: aireply.reply,
                agent: 'bot'
            })

            existingChat.context = aireply.context

            if (project) {

                project.context = aireply.projectContext

                await project.save()

            }

            await existingChat.save()

        }

        ResponseHandler.sendSuccess(res, { chat: initialChat, message: newMessage }, 200);

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

router.get('/:id/messages', authMiddleware, async (req, res) => {

    try {

        const { id } = req.params

        const messages = await MessageModel.find({
            chatID: id,
            userID: req.user._id
        }).sort({ createdAt: 1 })

        ResponseHandler.sendSuccess(res, messages, 200);

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

module.exports = router;