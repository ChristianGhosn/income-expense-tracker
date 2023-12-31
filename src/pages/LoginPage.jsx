import React, { useState } from "react";
import toast from "react-hot-toast";
import Joi from "joi";

import { useAuth } from "../context/AuthContext";
import validateForm from "../utils/ValidateForm";

import google from "../assets/google.svg";
import Input from "../components/Input";
import Loader from "../components/Loader";

const LoginPage = () => {
  const { loginWithGoogle, loginWithEmail, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().required(),
  });

  const loginWithEmailAndPassword = (e) => {
    e.preventDefault();
    const errorData = validateForm({ email, password }, schema);
    if (errorData) {
      toast.error("Missing or incorrect fields!");
      return setErrors(errorData);
    }
    loginWithEmail(email, password);
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="w-full mt-6">
          <form
            className="w-full flex flex-col gap-4 justify-center items-center"
            onSubmit={loginWithEmail}
          >
            <h1 className="text-2xl">Login</h1>
            <div className="w-1/2 flex flex-col gap-2 items-center">
              <Input
                type="text"
                name="email"
                placeholder="Email..."
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                errors={errors}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                errors={errors}
              />
              <button
                onClick={loginWithEmailAndPassword}
                type="submit"
                className="bg-silver py-2 px-4 rounded-lg hover:bg-royal-purple hover:text-white w-full flex gap-2 items-center justify-center"
              >
                Login
              </button>
              <button
                onClick={loginWithGoogle}
                type="button"
                className="bg-silver py-2 px-4 rounded-lg hover:bg-royal-purple hover:text-white w-full flex gap-2 items-center justify-center"
              >
                <img src={google} alt="Google Logo" />
                Login With Google
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LoginPage;
