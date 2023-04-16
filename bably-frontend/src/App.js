import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./buttons.css";
import { useState, useEffect } from "react";
import BablyApi from "./api";
import { decodeToken } from "react-jwt";
import UserContext from "./users/UserContext";
import Spinner from "./common/Spinner";
import { useLocalStorage } from "./hooks";
import NavRoutes from "./navigation/NavRoutes";
import Navbar from "./navigation/Navbar";
import { stopBeams } from "./common/PushNotifications";

function App() {
  const [token, setToken] = useLocalStorage("bably-token");
  const [childId, setChildId] = useLocalStorage("childId");
  const [currUser, setCurrUser] = useState(null);
  const [currChild, setCurrChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrUser() {
      if (token) {
        try {
          let { email } = decodeToken(token);
          BablyApi.token = token;
          let user = await BablyApi.getCurrUser(email);
          setCurrUser(user);
          if (user.infants.length && !childId) {
            setChildId(user.infants[0].id);
          } else if (!user.infants.length) {
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          setCurrUser(null);
        }
      }
    }
    setLoading(true);
    getCurrUser();
  }, [token, childId, setChildId]);

  useEffect(() => {
    async function getCurrChild() {
      if (childId) {
        try {
          let child = await BablyApi.getCurrChild(childId);
          setCurrChild(child);
        } catch (err) {
          console.log(err);
          setCurrChild(null);
        }
      }
      setLoading(false);
    }
    getCurrChild();
  }, [childId]);

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
    setCurrChild(null);
    setToken(null);
    setChildId(null);
    stopBeams();
  };

  const registerInfant = async (data) => {
    try {
      let newChild = await BablyApi.registerInfant(currUser.id, data);
      setChildId(newChild.id);
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  const updateInfant = async (id, data) => {
    let child = await BablyApi.updateInfant(id, data);
    setCurrChild(child);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider
          value={{
            currUser,
            currChild,
            registerInfant,
            updateInfant,
            setChildId,
          }}
        >
          <Navbar logout={logout} />
          {loading ? <Spinner /> : <NavRoutes login={login} signup={signup} />}
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
