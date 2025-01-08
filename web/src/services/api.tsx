import axios from "axios";

let currentBaseURL = "http://localhost:8080/api";

const createAxiosInstance = () => {
    return axios.create({
        baseURL: currentBaseURL,
    });
};

const axiosInstance = createAxiosInstance();

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.baseURL = currentBaseURL; // Sempre usa a baseURL atual
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 503 || !error.response) {
            console.warn(
                `Backend principal indisponível. Alternando para o backend secundário...`
            );
            currentBaseURL = "http://localhost:8081/api"; // Atualiza para o backend secundário
            return axiosInstance.request({
                ...error.config,
                baseURL: currentBaseURL, // Garante que o pedido falho use o novo baseURL
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
