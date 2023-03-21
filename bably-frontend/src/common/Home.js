import React, { useContext } from "react";
import UserContext from "../users/UserContext";

function Home() {
  let { currUser } = useContext(UserContext);
  return (
    <div className="my-auto text-center text-light">
      <h1>Bably</h1>
      <p>Parenting Simplified</p>
      <p>{currUser ? `Welcome Back, ${currUser.firstName}!` : null}</p>
    </div>
  );
}
export default Home;
