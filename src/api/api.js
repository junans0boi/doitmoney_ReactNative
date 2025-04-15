// src/api/api.js
import axios from 'axios';

const API_BASE_URL = 'http://doitmoney.kro.kr';

export const api = {
  getTransactions: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/api/transactions/${userId}`);
    return response.data;
  },

  addTransaction: async (userId, transaction) => {
    const response = await axios.post(`${API_BASE_URL}/api/transactions/${userId}`, transaction);
    return response.data;
  },

  updateTransaction: async (userId, transactionId, updatedData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/transactions/${userId}/${transactionId}`,
      updatedData
    );
    return response.data;
  },

  deleteTransaction: async (userId, transactionId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/api/transactions/${userId}/${transactionId}`
    );
    return response.data;
  },

  loginUser: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/api/users/login`, credentials);
    return response.data;
  },

  registerUser: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/api/users/register`, userData);
    return response.data;
  },

  addFixedExpense: async (userId, fixedExpense) => {
    const response = await axios.post(`${API_BASE_URL}/api/fixed-expenses/${userId}`, fixedExpense);
    return response.data;
  },

  addAccount: async (userId, account) => {
    const res = await axios.post(`${API_BASE_URL}/api/accounts/${userId}`, account);
    return res.data;
  },

  getAccounts: async (userId) => {
    const res = await axios.get(`${API_BASE_URL}/api/accounts/${userId}`);
    return res.data;
  },

  updateAccount: async (userId, accountId, account) => {
    const res = await axios.put(`${API_BASE_URL}/api/accounts/${userId}/${accountId}`, account);
    return res.data;
  },

  deleteAccount: async (userId, accountId) => {
    const res = await axios.delete(`${API_BASE_URL}/api/accounts/${userId}/${accountId}`);
    return res.data;
  },

  getTodayNews: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/news/today`);
    return response.data;
  },
}; 