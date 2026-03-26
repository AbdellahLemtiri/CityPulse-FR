import axios from "axios";

 const axiosClient = axios.create({
  baseURL: `http://127.0.0.1:8000/api`  
});

 axiosClient.interceptors.request.use((config) => {
  //  const token = localStorage.getItem('ACCESS_TOKEN');
 const  token = "15|4a2DQiqLbcUxWwixrUM4ti2tGlkbExsfHse0xYiI093511f1";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

 axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
     if (response && response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');
      window.location.reload();  
    }
    
     if (response && response.status === 404) {
      console.error("Endpoint non trouvé");
    }

    throw error;
  }
);

export default axiosClient;