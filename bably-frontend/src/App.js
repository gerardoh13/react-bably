import { BrowserRouter } from "react-router-dom";
import './App.css';
import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";
import UserContext from "./users/UserContext";
import Spinner from "./common/Spinner";
import { useLocalStorage } from "./hooks";
import NavRoutes from "./navigation/NavRoutes";
import Navbar from "./common/Navbar";

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
      // try {
      //   let { username } = decodeToken(token);
      //   JoblyApi.token = token;
      //   let user = await JoblyApi.getCurrUser(username);
      //   setCurrUser(user);
      //   setApplicationIds(new Set(user.applications));
      // } catch (err) {
      //   console.log(err);
      //   setCurrUser(null);
      // }
      // setLoading(false);
    }
    // setLoading(true);
    getCurrUser();
  }, [token]);

  const login = async (data) => {
    try {
      // let userToken = await JoblyApi.login(data);
      // setToken(userToken);
      return { valid: true };
    } catch (errors) {
      return { valid: false, errors };
    }
  };

  const signup = async (data) => {
    try {
      // let userToken = await JoblyApi.register(data);
      // setToken(userToken);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  };

  const logout = async () => {
    setCurrUser(null);
    setToken(null);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider
          value={{
            currUser
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
