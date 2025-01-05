import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    console.log("Token enviado no header:", localStorage.getItem("authToken"));
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);

});

api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        console.error('Erro de autenticação. Faça login novamente.');
    }
    return Promise.reject(error);
});



export default api;
