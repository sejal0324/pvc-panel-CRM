import axios from 'axios';

const BASE = 'http://localhost:3000/leads';
const getToken = () => localStorage.getItem('token');
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const getLeads = async () => {
     const response = await axios.get(BASE, authHeader());
     return response.data;
};

export const getLeadById = async (id) => {
     const response = await axios.get(`${BASE}/${id}`, authHeader());
     return response.data;
};

export const approveLead = async (id) => {
     const response = await axios.patch(`${BASE}/${id}/approve`, {}, authHeader());
     return response.data;
};

export const rejectLead = async (id) => {
     const response = await axios.patch(`${BASE}/${id}/reject`, {}, authHeader());
     return response.data;
};

export const discoverLeads = async () => {
    const response = await axios.post(
        `${BASE}/discover`,
        {},
        authHeader()
    );

    return response.data;
};