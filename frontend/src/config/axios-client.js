import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
  withXSRFToken: true 
});


axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    const { response } = error;

    if (response && response.status === 401) {
      localStorage.removeItem('user'); 
      if (window.location.pathname !== '/login') {
         window.location.href = "/login";
      }
    }

    return Promise.reject(error); 
  }
);

export default axiosClient;