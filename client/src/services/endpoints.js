// services/endpoints.js

const BASE_URL = '/api';

const sendRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const endpoints = {
  getFlashcardsBySetId: async (setId) => {
    return sendRequest(`${BASE_URL}/flashcards?set=${setId}`);
  },

  registerUser: async (credentials) => {
    return sendRequest(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  },

  signInUser: async (credentials) => {
    return sendRequest(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  },

  getSets: async () => {
    return sendRequest(`${BASE_URL}/sets`, { method: 'GET' });
  },

  createSet: async (setData) => {
    return sendRequest(`${BASE_URL}/sets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(setData),
    });
  },

  generateFlashcards: async (fileData) => {
    return sendRequest(`${BASE_URL}/generate`, {
      method: 'POST',
      body: fileData,  // expects FormData for file uploads
    });
  },

  generateQuiz: async (setId) => {
    return sendRequest(`${BASE_URL}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setId }),
    });
  },

  insertFlashcards: async (setId, flashcards) => {
    return sendRequest(`${BASE_URL}/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setId, flashcards }),
    });
  },
};

export default endpoints;
