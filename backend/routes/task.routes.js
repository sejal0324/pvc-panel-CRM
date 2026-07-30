const taskController=require('../controllers/task.controller')
const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();

router.get("/",authenticate,taskController.getTasks);

module.exports=router;