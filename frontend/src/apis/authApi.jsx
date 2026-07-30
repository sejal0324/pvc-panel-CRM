import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export const login = async (loginData) => {
    const response = await axios.post(`${API_URL}/login`, loginData   );
    return response.data;
};

export const signup = async (signupData) => {
    const response = await axios.post(`${API_URL}/signup`, signupData);
    return response.data;
};