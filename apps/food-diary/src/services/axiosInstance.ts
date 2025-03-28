
import axios from 'axios';
import useKeycloak from '../hooks/useKeycloak';

const createAxiosInstance = () => {
    const { keycloak } = useKeycloak();

    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL as string
    });

    instance.interceptors.request.use((config) => {
        if (keycloak?.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    });

    return instance;
};

export default createAxiosInstance;
