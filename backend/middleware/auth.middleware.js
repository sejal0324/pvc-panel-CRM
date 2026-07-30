const jwt = require("jsonwebtoken");

async function authenticate(req,res,next){
     const authHeader= req.headers.authorization;
     console.log(req.headers.authorization);
     if (!authHeader) {
    return res.status(401).json({
        message: "Authorization header missing"
    });
}
     const token = authHeader.split(" ")[1];
     let payload;
     try {
          payload = jwt.verify(
          token,
          process.env.JWT_SECRET);
}
     catch(error) {
          return res.status(401).json({message: "Invalid token"});
}
console.log("Middleware payload:", payload);
req.user = payload;
next();

}

module.exports = {
   authenticate
};