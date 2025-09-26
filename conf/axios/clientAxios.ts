import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: 'http://localhost:3000', // Cambia por tu URL real
  timeout: 10000,
});

export default clienteAxios;