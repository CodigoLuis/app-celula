import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: 'http://192.168.1.4:3000', // Cambia por tu URL real 
  // baseURL: 'http://192.168.1.6:3000' || 'http://localhost:3000', // Cambia por tu URL real 
  timeout: 10000,
});

export default clienteAxios;