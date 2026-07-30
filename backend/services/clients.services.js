const clientRepository = require('../repositories/clients.repo');
const { analyzeClient } = require('./llm.services');
const taskRepository=require("../repositories/task.repo");
 

async function createClient(clientData, investorId) {
    // validation
    const existingClient = await clientRepository.findByPhone(clientData.phone);
    const assignedInvestor = await clientRepository.checkZone(investorId, clientData.zone_id);
    console.log(clientData.zone_id);
    console.log(investorId);
    if (existingClient) {
        throw new Error('Client already exists');
    }
    if (!assignedInvestor) {
        throw new Error('this investor is not assigned to this zone');
    }
    const newClient = await clientRepository.create(clientData, investorId);

    return newClient;
}

async function GetClient(investorId) {
    const getZone = await clientRepository.getZone(investorId);
    const client = await clientRepository.getClient(getZone.zone_id);
    if (!getZone) {
        throw new Error('no zone has been assigned to the investor');
    }
    if(!client){

        throw new Error("Client not found");

    }
    return client;

}
    

async function GetClientById(id) {
    const client = await clientRepository.getById(id);
    if (!client) {
        throw new Error("client does not exist");
    }

    const ai = await analyzeClient(client);

    return {
        ...client,
        ai
    };
}

async function updateClient(id, clientData, investorId) {
    const existingClient = await clientRepository.getById(id);
    if (!existingClient) {
        throw new Error('Client does not exist');
    }

    const assignedInvestor = await clientRepository.checkZone(investorId, clientData.zone_id);
    if (!assignedInvestor) {
        throw new Error('this investor is not assigned to this zone');
    }

    const updatedClient = await clientRepository.update(id, clientData, investorId);
    return updatedClient;
}

async function deleteClient(id) {
    const existingClient = await clientRepository.getById(id);
    if (!existingClient) {
        throw new Error('Client does not exist');
    }
    const deletedClient = await clientRepository.Delete(id);
    return deletedClient;

}


async function scheduleVisit(clientId,investorId,dueDate){
return await taskRepository.create({
client_id:clientId,
investor_id:investorId,
task_type:"VISIT",
due_date:dueDate
});

}

async function scheduleFollowUp(clientId,investorId,dueDate){
return await taskRepository.create({
client_id:clientId,
investor_id:investorId,
task_type:"FOLLOW_UP",
due_date:dueDate
});
}

module.exports = {
    createClient,
    GetClient,
    GetClientById,
    updateClient,
    deleteClient,
    scheduleFollowUp,
    scheduleVisit
};