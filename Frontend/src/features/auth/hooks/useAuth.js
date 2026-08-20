import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
        const data = await login({ email, password });
        setUser(data.user);
        return true;
    } catch (error) {
        console.error("Login error:", error);
        return false;
    } finally {
        setLoading(false);
    }
};

const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
        const data = await register({ username, email, password });
        setUser(data.user);
        return true;
    } catch (error) {
        console.error("Register error:", error);
        return false;
    } finally {
        setLoading(false);
    }
};

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

// This code doesnt work soo i have to switch to try and catch bcoz it was throwing error 

//   useEffect(()=>{
//     const getAndSetUser = async ()=>{
//         const data = await getMe()
//         setUser(data.user)
//         setLoading(false)
//     }
//   })

  useEffect(() => {
    const getAndSetUser = async () => {
        try {
            const data = await getMe();

            if (data?.user) {
                setUser(data.user);
            }
        } catch (error) {
            setUser(null);
            console.error("Get me error:", error);
        } finally {
            setLoading(false);
        }
    };

    getAndSetUser();
}, []);
   

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
