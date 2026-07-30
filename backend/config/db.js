const {Pool}=require("pg");

const pool = new Pool({
    user: 'mai',
    host: 'localhost',
    database: 'clientmanagerdb',
    password: 'goal123',
    port: 5432,
});

module.exports = pool;

