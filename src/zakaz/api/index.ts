import axios from 'axios';

const zakazApi = axios.create({
  baseURL: 'https://stores-api.zakaz.ua',
  headers: {
    'accept-language': 'uk',
  },
});

export { zakazApi };
