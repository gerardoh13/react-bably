import { BrowserRouter } from "react-router-dom";
import './App.css';
import { useState, useEffect } from "react";
import BablyApi from "./api";
import { decodeToken } from "react-jwt";
import UserContext from "./users/UserContext";
import Spinner from "./common/Spinner";
import { useLocalStorage } from "./hooks";
import NavRoutes from "./navigation/NavRoutes";
import Navbar from "./navigation/Navbar";

function App() {
  const [token, setToken] = useLocalStorage("bably-token");
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        let { email } = decodeToken(token);
        BablyApi.token = token;
        let user = await BablyApi.getCurrUser(email);
        console.log(user)
        setCurrUser(user);
      } catch (err) {
        console.log(err);
        setCurrUser(null);
      }
      setLoading(false);
    }
    setLoading(true);
    getCurrUser();
  }, [token]);

  const login = async (data) => {
    try {
      let userToken = await BablyApi.login(data);
      setToken(userToken);
      return { valid: true };
    } catch (errors) {
      return { valid: false, errors };
    }
  };

  const signup = async (data) => {
    try {
      let userToken = await BablyApi.registerUser(data);
      setToken(userToken);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  };

  const logout = async () => {
    setCurrUser(null);
    setToken(null);
  };

  const registerInfant = async (data) => {
    if (!currUser) return;
    try {
      await BablyApi.registerInfant(currUser.id, data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider
          value={{
            currUser,
            registerInfant
          }}
        >
          <Navbar logout={logout} />
          {loading ? <Spinner /> : <NavRoutes login={login} signup={signup}/>}
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
