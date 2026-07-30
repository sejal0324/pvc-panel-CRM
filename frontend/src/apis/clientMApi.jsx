import axios from "axios";
const BASE = "http://localhost:3000/clients";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const clientForm = async (clientData) => {
     const token = localStorage.getItem("token");
     const response = await axios.post("http://localhost:3000/clients",
          clientData, { headers: { Authorization: `Bearer ${token}` } });
     return response.data;
}

export const getClients = async () => {
     const token = localStorage.getItem('token');
     const response = await axios.get("http://localhost:3000/clients", {
          headers
               : { Authorization: `Bearer ${token}` }
     });
     return response.data;
}

export const getClientById = async (id) => {
     const token = localStorage.getItem('token');
     const response = await axios.get(`http://localhost:3000/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
     });
     return response.data;
}

export const updateClient = async (id, clientData) => {
     const token = localStorage.getItem('token');
     const response = await axios.put(`http://localhost:3000/clients/${id}`, clientData, {
          headers: { Authorization: `Bearer ${token}` }
     });
     return response.data;
}

export const deleteClient = async (id) => {
     const token = localStorage.getItem('token');
     const response = await axios.delete(`http://localhost:3000/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
     });
     return response.data;
}

export const scheduleVisit = async(id,dueDate)=>{

    const response=await axios.post(

        `${BASE}/${id}/visit`,

        {dueDate},

        authHeader()

    );

    return response.data;

}

export const scheduleFollowUp = async(id,dueDate)=>{

    const response=await axios.post(

        `${BASE}/${id}/followup`,

        {dueDate},

        authHeader()

    );

    return response.data;

}