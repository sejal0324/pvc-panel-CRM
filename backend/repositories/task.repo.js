const pool=require("../config/db");

async function create(task){

const result=await pool.query(

`

INSERT INTO task

(

client_id,

investor_id,

task_type,

due_date

)

VALUES

($1,$2,$3,$4)

RETURNING *

`,

[

task.client_id,

task.investor_id,

task.task_type,

task.due_date

]

);

return result.rows[0];

}

async function getTodayTasks(

investorId

){

const result=await pool.query(

`

SELECT

t.*,

c.business_name

FROM task t

JOIN client c

ON t.client_id=c.client_id

WHERE

investor_id=$1

ORDER BY due_date

`,

[investorId]

);

return result.rows;

}

module.exports={

create,

getTodayTasks

};