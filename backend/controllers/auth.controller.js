const authService = require('../services/auth.services');

async function signUp(req, res) {
    try {
     const { email, username, role, password } = req.body;
        const newUser = await authService.signUp({ username,email, password,role});
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}

async function login(req, res) {
   
    try {
        const { email, password,role } = req.body;
        const token = await authService.login({ email, password,role});
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    
}

module.exports = {
    signUp,
    login
};

