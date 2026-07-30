import * as authApi from "../apis/authApi";

export const login = async (loginData) => {
    try {
        const response = await authApi.login(loginData);
        localStorage.setItem("token", response.token);
        return response;
    } catch (error) {
        console.log(error.response.data);
        throw error;
    }
};

export const signup = async (signupData) => {
    try {
        const response = await authApi.signup(signupData);
        return response;
    } catch (error) {
        console.log(error.response.data);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
};