import apiClient from '../utils/apiClient';

export const signIn = (data) => apiClient.post('/auth/login', data);
export const signUp = (data) => apiClient.post('/auth/signup', data);
