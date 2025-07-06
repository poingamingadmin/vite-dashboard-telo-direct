import { useState, useEffect, createContext, useRef } from "react";
import AxiosInstance from "../components/Api/AxiosInstance";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const getCachedUser = () => {
    const cachedUser = localStorage.getItem("auth_admin");
    return cachedUser ? JSON.parse(cachedUser) : null;
  };

  const fetchUser = async () => {
    const cachedUser = getCachedUser();

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (!cachedUser || !cachedUser.logo || !cachedUser.exp) {
        const res = await AxiosInstance.get("/auth/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          const data = res.data;
          const updatedUser = cachedUser
            ? { ...cachedUser, logo: data.logo, exp: data.exp }
            : data;
          setUser(updatedUser);
          localStorage.setItem("auth_admin", JSON.stringify(updatedUser));
        } else {
          setUser(null);
        }
      } else {
        setUser(cachedUser);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchUser();
  }, []);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("auth_admin", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_admin");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_menu");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
