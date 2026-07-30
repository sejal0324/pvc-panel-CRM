

import axios from "axios";

const BASE = "http://localhost:3000/tasks";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const getTasks = async () => {

    const response = await axios.get(
        BASE,
        authHeader()
    );

    return response.data;

};