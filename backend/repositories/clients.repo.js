const pool = require("../config/db");


pool.query("SELECT NOW()")
     .then(result => {
          console.log(result.rows);
     })
     .catch(err => {
          console.error(err);
     });

async function create(Data, Id) {
     const result = await pool.query(
          "INSERT INTO client(zone_id,business_name,owner_name,phone,address,client_type,status,created_by,updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
          [Data.zone_id, Data.business_name, Data.owner_name, Data.phone, Data.address, Data.client_type, Data.status, Id, Id]
     );
     return result.rows[0];
}

async function findByPhone(phone) {
     const result = await pool.query(
          "SELECT * FROM client WHERE phone = $1",
          [phone]
     );
     return result.rows[0];
}

async function checkZone(id, zoneId) {
     const result = await pool.query(
          "SELECT * FROM zone_assignment WHERE investor_id = $1 AND zone_id = $2",
          [id, zoneId]
     );
     return result.rows[0];
}
async function getZone(id) {
     const result = await pool.query(
          "SELECT * FROM zone_assignment WHERE investor_id=$1",
          [id]
     );
     return result.rows[0];
}
async function getClient(zoneId) {
     const result = await pool.query(
          "SELECT * FROM client WHERE zone_id=$1 AND is_active= TRUE",
          [zoneId]
     );
     return result.rows;
}
async function getById(id) {
     const result = await pool.query(
          "SELECT * FROM client WHERE client_id=$1",
          [id]
     );
     return result.rows[0];
}
async function update(id, Data, userId) {
     const result = await pool.query(
          `UPDATE client 
           SET business_name = $1, owner_name = $2, phone = $3, address = $4, client_type = $5, status = $6, zone_id = $7, updated_by = $8, updated_at = NOW()
           WHERE client_id = $9 AND is_active=TRUE
           RETURNING *`,
          [Data.business_name, Data.owner_name, Data.phone, Data.address, Data.client_type, Data.status, Data.zone_id, userId, id]
     );
     return result.rows[0];
}

async function Delete(id) {
     const result = await pool.query(
          `UPDATE client
          SET is_active = FALSE , updated_at=NOW()
          WHERE client_id=$1
          RETURNING *`,
          [id]
     );
     return result.rows[0];
}
module.exports = {
     create,
     findByPhone,
     checkZone,
     getZone,
     getClient,
     getById,
     update,
     Delete
};