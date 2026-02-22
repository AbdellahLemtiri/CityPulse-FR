/*************  ✨ Smart Paste 📚  *************/
const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, setTokenLocalStorage] = useState(() => localStorage.getItem('ACCESS_TOKEN') || null);

    const setToken = (token) => {
        setTokenLocalStorage(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    return (
        <StateContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
/*******  654348cc-1722-4e20-9457-79fc6c1247b0  *******/