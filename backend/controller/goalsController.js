const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalsModal");
const { error } = require("console");

const getGoals = asyncHandler(async (req, res) => {
    console.log(req.user.id);
    const goals = await Goal.find({ user: req.user.id });
    console.log(goals);
    res.status(200).json(goals);
});

const postGoals = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error("Text field is required");
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id // Associate the goal with the current user
    });

    res.status(201).json(goal);
});

const putGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(400);
        throw new Error('Goal not found');
    }

    // Optionally, you can check if the user is authorized to update this goal
    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedGoal);
});

const deleteGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(400);
        throw new Error('Goal not found');
    }

    // Optionally, you can check if the user is authorized to delete this goal
    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await Goal.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: `Goal with id ${req.params.id} deleted` });
});

module.exports = {
    getGoals,
    postGoals,
    putGoals,
    deleteGoals,
};
