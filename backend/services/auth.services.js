const authRepository = require('../repositories/auth.repo');
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');

async function signUp(userData) {
     const existingUser = await authRepository.findUserByEmail(userData.email);
     if (existingUser){
           throw new Error('User already exists');
     }
     const existingUsername = await authRepository.findUserByUsername(userData.username);
     if (existingUsername){
           throw new Error('Username already exists');
     }
     const hash= await bcrypt.hash(userData.password, 10);
     const newUser = await authRepository.createUser(userData.username, userData.email, hash, userData.role);
     if(userData.role=="investor"){
      const newInvestor=await authRepository.createInvestor(newUser.user_id);
      console.log(newInvestor);
     }
     
     return { username:newUser.username,
      email:newUser.email, role: newUser.role};
     
}

async function login(userData) {
      const validUser = await authRepository.findUserByEmail(userData.email);
      if (!validUser) {
            throw new Error('Invalid email');
      }
      const isPasswordValid = await bcrypt.compare(userData.password, validUser.password_hash);
      if (!isPasswordValid) {
            throw new Error('Invalid password');
      }
      const investorId =await authRepository.findInvestorId(validUser.user_id);
      console.log(investorId);
      const token = generateToken(validUser,investorId);
      return token;
}
      
      
      function generateToken(user,investor) {
      const payload={ userId: user.user_id,
                      investorId : investor.investor_id,
                      role: user.role
      };
      const token=jwt.sign(
            payload, process.env.JWT_SECRET,{expiresIn: "1d"}
      );
      return token;
}



      module.exports = {
    signUp,
    login   
}