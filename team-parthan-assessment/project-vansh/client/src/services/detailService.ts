
import api from './api';
export const getDetails = async ()=>{
    const response = await api.get('/me');
    return response.data;
}