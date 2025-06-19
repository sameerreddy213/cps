
import api from './api';
export const getDetails = async ()=>{
    const response = await api.get('/me');
    return response.data;
}
export const uploadPhoto = async(photo:string)=>{
    await api.post('/me/upload-photo',{photo});
};