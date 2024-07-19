const express = require('express');
const routers = express.Router();
const { getGoals, postGoals,putGoals,deleteGoals } = require("../controller/goalsController");
const {protect} = require("../middleware/authMiddleware");

routers.route("/").get(protect,getGoals).post(protect, postGoals);
routers.route("/:id").put(protect, putGoals).delete(protect,deleteGoals);


module.exports = routers;