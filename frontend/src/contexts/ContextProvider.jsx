<<<<<<< HEAD
import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../config/axios-client';
=======
import { createContext, useContext, useState } from 'react';
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8

const StateContext = createContext({
  user: null,
  setUser: () => {},
<<<<<<< HEAD
  isCheckingAuth: true,
=======
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
<<<<<<< HEAD
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
=======

   return (
    <StateContext.Provider value={{ user, setUser }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
