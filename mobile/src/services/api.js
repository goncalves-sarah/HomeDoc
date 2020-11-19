import axios from 'axios';
//Add your own IpAdress
const api = axios.create({
    baseURL: 'http://IpAdress:8000'
});

export default api;