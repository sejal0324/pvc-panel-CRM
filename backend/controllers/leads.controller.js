const leadService = require('../services/leads.services');


async function createLead(req, res) {
     const leadData = req.body;
     const investorId = req.user.investorId;
     try {
          const newLead = await leadService.createLead(leadData, investorId);
          return res.status(201).json({ message: 'Lead created successfully', lead: newLead });
     } catch (error) {
          console.error(error);
          return res.status(500).json(error.message);
     }
}

async function getLeads(req, res) {
     const investorId = req.user.investorId;
     console.log(req);
     
     try {
          const leads = await leadService.getLeads(investorId);
          console.log(leads)
          return res.status(200).json(leads);
     } catch (error) {
          console.error(error);
          return res.status(500).json({ error: error.message });
     }
}

async function getLeadById(req, res) {
     const { id } = req.params;
     try {
          const lead = await leadService.getLeadById(id);
          return res.status(200).json(lead);
     } catch (error) {
          console.error(error);
          return res.status(404).json({ error: error.message });
     }
}

async function approveLead(req, res) {
     const { id } = req.params;
     const investorId = req.user.investorId;
     try {
          const result = await leadService.approveLead(id, investorId);
          return res.status(200).json({ message: 'Lead approved successfully', client: result });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ error: error.message });
     }
}

async function rejectLead(req, res) {
     const { id } = req.params;
     const investorId = req.user.investorId;
     try {
          const lead = await leadService.rejectLead(id, investorId);
          return res.status(200).json({ message: 'Lead rejected', lead });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ error: error.message });
     }
}
async function discoverLead(req,res){
     const investorId=req.user.investorId;
     try{
          const discover=await leadService.discoverLead(investorId);
          return res.status(200).json({ message: `lead discovered`, discover});
     } catch(error){
          console.error(error);
          return res.status(500).json({error: error.message})
     }
}

module.exports = {
     createLead,
     getLeads,
     getLeadById,
     approveLead,
     rejectLead,
     discoverLead
};
