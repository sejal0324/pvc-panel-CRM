const leadRepository = require('../repositories/leads.repo');
const clientRepository = require('../repositories/clients.repo');
const { qualifyLead } = require('../engines/leadQualification.engine');
const discoveryEngine=require('../engines/leadDiscovery.engine');

async function discoverLead(investorId){
     const zone=await leadRepository.getInvestorZone(investorId);
     const leads= await discoveryEngine.discover(zone.zone_name);
     if (leads.length===0){
          throw new Error(
               `the zone is inaccurate`
          );}
     const createdLeads = [];
     for (const lead of leads) {
     lead.zone_id = zone.zone_id;
     const createdLead = await createLead(lead,investorId);
     createdLeads.push(createdLead);
    }
    return createdLeads;   
}

async function createLead(leadData, investorId) {
     const duplicate = await leadRepository.checkDuplicate({
          phone: leadData.phone,
          business_name: leadData.business_name,
          address: leadData.address
     });
     //if (duplicate) {
        //  throw new Error(
          //     `Duplicate lead detected. A lead already exists with the same ` +
           //    `phone, business name, or address (lead_id: ${duplicate.lead_id})`
        //  );
     //}

     const assignedZone = await clientRepository.checkZone(investorId, leadData.zone_id);
     if (!assignedZone) {
          throw new Error('This investor is not assigned to this zone');
     }

     // Score the lead — save regardless of status
     const qualification = qualifyLead(leadData);

     const newLead = await leadRepository.create({
          ...leadData,
          ...qualification
     }, investorId);

     return newLead;
}

async function getLeads(investorId) {
     const zoneAssignment = await clientRepository.getZone(investorId);
     if (!zoneAssignment) {
          throw new Error('No zone has been assigned to this investor');
     }

     const leads = await leadRepository.getAll(zoneAssignment.zone_id);
     return leads;
}

async function getLeadById(id) {
     const lead = await leadRepository.getById(id);
     if (!lead) {
          throw new Error('Lead does not exist');
     }
     return lead;
}

async function approveLead(id, investorId) {
     const lead = await leadRepository.getById(id);
     if (!lead) {
          throw new Error('Lead does not exist');
     }

     // State guard — prevent double-approval or approving a rejected lead
     if (lead.approval_status === 'APPROVED') {
          throw new Error('Lead has already been approved');
     }
     if (lead.approval_status === 'REJECTED') {
          throw new Error('Cannot approve a lead that has already been rejected');
     }

     // Convert lead → client
     const clientData = {
          zone_id: lead.zone_id,
          business_name: lead.business_name,
          owner_name: lead.owner_name,
          phone: lead.phone,
          address: lead.address,
          client_type: lead.client_type,
          status: 'ACTIVE'
     };

     // Run inside a single PostgreSQL transaction
     const newClient = await leadRepository.approveWithTransaction(id, clientData, investorId);

     return newClient;
}

async function rejectLead(id, investorId) {
     const lead = await leadRepository.getById(id);
     if (!lead) {
          throw new Error('Lead does not exist');
     }

     // State guard — prevent rejecting an already-actioned lead
     if (lead.approval_status === 'REJECTED') {
          throw new Error('Lead has already been rejected');
     }
     if (lead.approval_status === 'APPROVED') {
          throw new Error('Cannot reject a lead that has already been approved');
     }

     const updatedLead = await leadRepository.updateApproval(id, 'REJECTED', investorId);
     return updatedLead;
}

module.exports = {
     createLead,
     getLeads,
     getLeadById,
     approveLead,
     rejectLead,
     discoverLead
};
