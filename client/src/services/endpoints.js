const BASE_URL = 'https://www.gatin.dev/api';

const endpoints = {
  signInUser: async (data) => {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
  },

  registerUser: async (data) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
  },

  getUserSets: async () => {
    const response = await fetch(`${BASE_URL}/sets`, { credentials: 'include' });
    console.log(response)
    if (!response.ok && response.status !== 401) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
  },

  createSet: async (data) => {
    const response = await fetch(`${BASE_URL}/sets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok && response.status !== 401) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
  },

  generateFlashcards: async (data) => {
    var json = JSON.stringify(data);
    console.log(json)
    const response = await fetch(`${BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: json,
    });
    if (!response.ok && response.status !== 401) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
  },

  generateQuiz: async (setId) => {
    const response = await fetch(`${BASE_URL}/quiz?set=${setId}`, { // changed to GET with query parameter
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok && response.status !== 401) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
  },

  getFlashcardsBySetId: async (setId) => {
    const response = await fetch(`${BASE_URL}/flashcards?set=${setId}`); // Ensure this matches backend query param handling
    if (!response.ok && response.status !== 401) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
  },

  insertFlashcards: async (data) => {
    const response = await fetch(`${BASE_URL}/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  },

  getQuizzes: async () => {
    const response = await fetch(`${BASE_URL}/quizzes`, { credentials: 'include' });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  },
};

export default endpoints;
