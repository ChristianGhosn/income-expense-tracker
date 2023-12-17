import React from "react";
import { useAuth } from "../context/AuthContext";

import google from "../assets/google.svg";

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="w-full ">
      <div className="h-screen flex justify-center items-center">
        <button
          onClick={login}
          className="bg-silver py-2 px-4 rounded-lg hover:bg-royal-purple hover:text-white md:w-fit sm:w-full flex gap-2 items-center justify-center"
        >
          <img src={google} alt="Google Logo" />
          Login With Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
