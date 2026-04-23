import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../config/axios-client';

const StateContext = createContext({
  user: null,
  setUser: () => {},
  isCheckingAuth: true,
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    axiosClient.get('/user').then(({ data }) => {
        setUser(data);
      }).catch(() => {
        setUser(null);
      }).finally(() => {
        setIsCheckingAuth(false);  
      });
  }, []);
  return <StateContext.Provider value={{ user, setUser,isCheckingAuth }}>{children}</StateContext.Provider>;
};

export const useStateContext = () => useContext(StateContext);
