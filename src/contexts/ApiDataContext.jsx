import { createContext, useContext, useEffect, useState } from 'react';
import AxiosInstance from '../components/Api/AxiosInstance';
import { UserContext } from './UserContext';

const ApiDataContext = createContext();

export const ApiDataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const { user, loading } = useContext(UserContext);

    const fetchData = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        try {
            const res = await AxiosInstance.get('/web-informations', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(res.data);
        } catch (error) {
            console.error('[ApiDataContext] Gagal fetch data:', error?.response?.status);
        }
    };

    useEffect(() => {
        if (!loading && user) {
            fetchData();
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [loading, user]);

    return (
        <ApiDataContext.Provider value={data}>
            {children}
        </ApiDataContext.Provider>
    );
};

export const useApiData = () => useContext(ApiDataContext);
