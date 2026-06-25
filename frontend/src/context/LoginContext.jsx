import {
     createContext,
     useCallback,
     useContext,
     useEffect,
     useState
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginContext = createContext();

const API_URL = "https://spend-analyzer-five.vercel.app/user";

export function LoginProvider({ children }) {
     const navigate = useNavigate();
     const location = useLocation();

     const [user, setUser] = useState(null);
     const [checkingLogin, setCheckingLogin] = useState(true);

     const checkLogin = useCallback(async () => {
          try {
               const response = await fetch(`${API_URL}/me`, {
                    credentials: "include"
               });

               if (response.status === 401 || response.status === 403) {
                    setUser(null);

                    if (
                         !["/", "/login", "/register","/about","/contact","/privacy","/terms"].includes(
                              location.pathname
                         )
                    ) {
                         navigate("/login", { replace: true });
                    }

                    return;
               }

               const data = await response.json();
               setUser(data.user);
          } catch (error) {
               console.error("Login check failed:", error);
          } finally {
               setCheckingLogin(false);
          }
     }, [location.pathname, navigate]);

     useEffect(() => {
          checkLogin();
     }, [checkLogin]);

     return (
          <LoginContext.Provider
               value={{
                    user,
                    setUser,
                    checkingLogin,
                    checkLogin
               }}
          >
               {children}
          </LoginContext.Provider>
     );
}

export const useLogin = () => useContext(LoginContext);