  import axios from "axios";

  const axiosClient = axios.create({
    baseURL: `http://127.0.0.1:8000/api`  
  });

  axiosClient.interceptors.request.use((config) => {
    //  const token = localStorage.getItem('ACCESS_TOKEN');
  const  token = "17|fPfj4V7FK5KlyIbvE4WZAiS5EKUwek686tlcd1sT2b27d086";
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