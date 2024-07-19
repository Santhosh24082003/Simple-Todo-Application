import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users/';

const register = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    console.log('Register response:', response.data);
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}login`, userData);
    console.log('Login response:', response.data);
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getMe = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}get`, config);
    console.log('GetMe response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const userService = {
  register,
  login,
  logout,
  getMe,
};

export default userService;
