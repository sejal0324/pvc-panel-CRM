const pool = require('../config/db');

async function create(data, investorId) {
     const result = await pool.query(
          `INSERT INTO lead
            (zone_id, business_name, owner_name, phone, address, client_type,
             approval_status, lead_score, qualification_status, qualification_reason,
             created_by, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', $7, $8, $9, $10, $10)
         RETURNING *`,
          [
               data.zone_id,
               data.business_name,
               data.owner_name,
               data.phone,
               data.address,
               data.client_type,
               data.lead_score,
               data.qualification_status,
               JSON.stringify(data.qualification_reason),
               investorId
          ]
     );
     return result.rows[0];
}

async function getAll(zoneId) {
     const result = await pool.query(
          `SELECT * FROM lead WHERE zone_id = $1`,
          [zoneId]
     );
     return result.rows;
}

async function getById(id) {
     const result = await pool.query(
          `SELECT * FROM lead WHERE lead_id = $1`,
          [id]
     );
     return result.rows[0];
}

// Atomically creates a client and updates the lead inside one transaction
async function approveWithTransaction(leadId, clientData, investorId) {
     const client = await pool.connect();
     try {
          await client.query('BEGIN');

          // Step 1: Insert new client
          const clientResult = await client.query(
               `INSERT INTO client
                    (zone_id, business_name, owner_name, phone, address, client_type, status, created_by, updated_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
                RETURNING *`,
               [
                    clientData.zone_id,
                    clientData.business_name,
                    clientData.owner_name,
                    clientData.phone,
                    clientData.address,
                    clientData.client_type,
                    clientData.status,
                    investorId
               ]
          );
          const newClient = clientResult.rows[0];

          // Step 2: Link client_id back to the lead
          await client.query(
               `UPDATE lead
                SET client_id = $1, updated_at = NOW(), updated_by = $2
                WHERE lead_id = $3`,
               [newClient.client_id, investorId, leadId]
          );

          // Step 3: Mark lead as approved
          await client.query(
               `UPDATE lead
                SET approval_status = 'APPROVED', updated_at = NOW(), updated_by = $1
                WHERE lead_id = $2`,
               [investorId, leadId]
          );

          await client.query('COMMIT');
          return newClient;
     } catch (error) {
          await client.query('ROLLBACK');
          throw error;
     } finally {
          client.release();
     }
}

async function updateApproval(id, status, investorId) {
     const result = await pool.query(
          `UPDATE lead
           SET approval_status = $1, updated_by = $2, updated_at = NOW()
           WHERE lead_id = $3
           RETURNING *`,
          [status, investorId, id]
     );
     return result.rows[0];
}

async function linkClient(id, clientId) {
     const result = await pool.query(
          `UPDATE lead
           SET client_id = $1, updated_at = NOW()
           WHERE lead_id = $2
           RETURNING *`,
          [clientId, id]
     );
     return result.rows[0];
}

async function checkDuplicate({ phone, business_name, address }) {
     const result = await pool.query(
          `SELECT * FROM lead
           WHERE
                (phone IS NOT NULL        AND phone = $1)
             OR (business_name IS NOT NULL AND LOWER(business_name) = LOWER($2))
             OR (address IS NOT NULL       AND LOWER(address) = LOWER($3))
           LIMIT 1`,
          [phone || null, business_name || null, address || null]
     );
     return result.rows[0];
}

async function getInvestorZone(investorId) {
    const result = await pool.query(
        `SELECT
            za.zone_id,
            z.zone_name
        FROM zone_assignment za
        JOIN zone z
            ON za.zone_id = z.zone_id
        WHERE za.investor_id = $1`,
        [investorId]
    );

    return result.rows[0];
}

module.exports = {
     create,
     getAll,
     getById,
     approveWithTransaction,
     updateApproval,
     linkClient,
     checkDuplicate,
     getInvestorZone
};
