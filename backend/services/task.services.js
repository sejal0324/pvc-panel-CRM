const taskRepository=require('../repositories/task.repo')

async function getTasks(investorId){
return await taskRepository.getTodayTasks(investorId);}

module.exports={getTasks}