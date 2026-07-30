const pool=require('../config/db');

async function findUserByEmail(email){
     const result=await pool.query(
          "SELECT * FROM users WHERE email=$1",
          [email]
     );
     return result.rows[0];
}

async function findInvestorId (userId){
     const result =await pool.query(
          "SELECT * FROM investors WHERE user_id =$1 ",
          [userId]
     );
     return result.rows[0];
}

async function findUserByUsername(username){
     const result=await pool.query(
          "SELECT * FROM users WHERE username=$1",
          [username]
     );
     return result.rows[0];
}

async function createUser(username,email,hash,role){
     const result=await pool.query(
          "INSERT INTO users(username,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING *",
          [username,email,hash,role]
     );
     return result.rows[0];
}

async function createInvestor(userId){
     const result=await pool.query(
          "INSERT INTO investors(user_id) VALUES($1) RETURNING *",
          [userId]
     );
     return result.rows[0];
}


module.exports={
    findUserByEmail,
    findUserByUsername,
    findInvestorId,
    createInvestor,
    createUser,


};