const express = require('express');
const ResponseHandler = require('../services/res_handler');
const authMiddleware = require('../middlewares/auth.middleware');
const ProjectModel = require('../models/project.model');
const router = express.Router();

// Add the projects
router.post('/', authMiddleware, async (req, res) => {

    try {

        const {
            title
        } = req.body

        const newProject = await ProjectModel.create({
            title,
            userID: req.user._id
        })

        ResponseHandler.sendSuccess(res, newProject, 201);

    } catch (error) {
        ResponseHandler.sendError(res, error.message, 400);
    }

})

// fetch the projects
router.get('/', authMiddleware, async (req, res) => {

    try {

        const projects = await ProjectModel.find({
            userID: req.user._id,
            markedDeleted: false
        })

        ResponseHandler.sendSuccess(res, projects, 200);

    } catch (error) {
        ResponseHandler.sendError(res, error.message, 400);
    }

})

// update the project
router.put('/:id', authMiddleware, async (req, res) => {

    try {

        const {
            id
        } = req.params

        const {
            title
        } = req.body

        const updatedProject = await ProjectModel.findByIdAndUpdate(id, {
            title
        }, {
            new: true
        })

        ResponseHandler.sendSuccess(res, updatedProject, 200);

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

// delete the project
router.delete('/:id', authMiddleware, async (req, res) => {

    try {

        await ProjectModel.findByIdAndUpdate(req.params.id, {
            markedDeleted: true
        })

        ResponseHandler.sendSuccess(res, null, 200);

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

module.exports = router;