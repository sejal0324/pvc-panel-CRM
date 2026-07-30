const clientRoutes = require('./routes/clients.routes');
const leadRoutes = require('./routes/leads.routes');
const taskRoutes = require("./routes/task.routes");
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/clients", clientRoutes);
app.use("/leads", leadRoutes);
app.use("/tasks", taskRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

