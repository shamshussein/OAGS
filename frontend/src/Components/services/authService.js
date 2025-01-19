import apiClient from '../utils/apiClient';

export const signIn = (data) => apiClient.post('/login', data);
export const signUp = (data) => apiClient.post('/signup', data);
