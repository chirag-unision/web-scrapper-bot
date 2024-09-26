const express = require("express")
const router = express.Router()

const {scheduleEvent}= require('../controllers/taskController')

router.post("/start", scheduleEvent)

module.exports= router