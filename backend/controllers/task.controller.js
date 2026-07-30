const taskService=require('../services/task.services')

async function getTasks(req,res){
const tasks=await taskService.getTasks(req.user.investorId);
res.json(tasks);}

module.exports={getTasks}