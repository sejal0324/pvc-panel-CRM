const clientService =
    require("../services/clients.services");

async function createClient(req, res) {
    const clientData = req.body;
    const investorId = req.user.investorId;
    try {
        const newClient = await clientService.createClient(clientData, investorId);
        return res.status(201).json("client created successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
async function getClient(req, res) {
    const investorId = req.user.investorId;
    try {
        const client = await clientService.GetClient(investorId);
        return res.status(201).json(client);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

}
async function getClientById(req, res) {
    const { id } = req.params;
    try {
        const client = await clientService.GetClientById(id);
        return res.status(200).json(client);
    } catch (error) {
        console.error(error);
        return res.status(404).json({ error: error.message });
    }
}

async function updateClient(req, res) {
    try {
        const updatedClient = await clientService.updateClient(
            req.params.id,
            req.body,
            req.user.investorId
        );
        return res.json({
            message: "Client updated successfully",
            client: updatedClient
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

async function deleteClient(req, res) {
    try {
        const deletedClient = await clientService.deleteClient(
            req.params.id
        );
        return res.json({
            message: "Client deleted successfully",
            client: deletedClient
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

async function scheduleVisit(req,res){
    console.log(req.body);
try{const task=await clientService.scheduleVisit(req.params.id,req.user.investorId,req.body.dueDate);}
catch (err) {

    console.error("MESSAGE:", err.message);
    console.error("DETAIL:", err.detail);
    console.error("CONSTRAINT:", err.constraint);
    console.error(err);

    res.status(500).json({
        error: err.message
    });

}
}

async function scheduleFollowUp(req,res){
try{const task=await clientService.scheduleFollowUp(req.params.id,req.user.investorId,req.body.dueDate);
res.status(201).json(task);
}
catch(err){res.status(500).json({error:err.message});
}}

module.exports = {
    createClient,
    getClient,
    getClientById,
    updateClient,
    deleteClient,
    scheduleVisit,
    scheduleFollowUp
};