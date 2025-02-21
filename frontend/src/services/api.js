import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Укажите ваш базовый URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
