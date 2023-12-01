import React, { useState } from "react";
import Login from "../users/Login";
import Signup from "../users/Signup";

function HomeAnon({ login, signup }) {
  const [currPage, setCurrPage] = useState("signup");

  return (
    <>
      <img
        src="bablybg.jpg"
        alt="bably bg"
        className="bablyBg d-none d-md-block"
      />
      <div className="text-light text-center my-4">
        <h1>Bably</h1>
        <h2>Parenting simplified</h2>
      </div>
      {currPage === "login" ? (
        <Login login={login} setCurrPage={setCurrPage} />
      ) : (
        <Signup signup={signup} setCurrPage={setCurrPage} />
      )}
    </>
  );
}
export default HomeAnon;
