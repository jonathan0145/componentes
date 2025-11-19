import apiClient from './apiClient';

const API_URL = '/user/privacy';


const getPrivacy = async () => {
  const res = await apiClient.get(API_URL);
  return res.data;
};

const savePrivacy = async (data) => {
  const res = await apiClient.put(API_URL, data);
  return res.data;
};

const privacyService = {
  getPrivacy,
  savePrivacy
};

export default privacyService;
