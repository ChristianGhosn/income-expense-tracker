import React, { useState } from "react";
import Joi from "joi";
import toast from "react-hot-toast";

import google from "../assets/google.svg";

import { useAuth } from "../context/AuthContext";
import validateForm from "../utils/ValidateForm";
import Input from "../components/Input";
import Loader from "../components/Loader";

const SignupPage = () => {
  const { signupWithEmail, loading, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    displayName: Joi.string().required(),
  });

  const signupWithEmailAndPassword = (e) => {
    e.preventDefault();
    const errorData = validateForm(
      {
        email,
        password,
        confirmPassword,
        displayName,
      },
      schema
    );
    if (errorData) {
      toast.error("Missing or incorrect fields!");
      return setErrors(errorData);
    }
    signupWithEmail(email, password, displayName);
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="w-full mt-6">
          <form
            onSubmit={signupWithEmailAndPassword}
            className="w-full flex items-center flex-col gap-4"
          >
            <h1 className="text-2xl">Sign Up</h1>
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
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                errors={errors}
              />
              <Input
                type="text"
                name="displayName"
                placeholder="Name..."
                value={displayName}
                onChange={(e) => setDisplayName(e.currentTarget.value)}
                errors={errors}
              />
              <button
                onClick={signupWithEmailAndPassword}
                type="submit"
                className="bg-silver py-2 px-4 rounded-lg hover:bg-royal-purple hover:text-white w-full flex gap-2 items-center justify-center"
              >
                Sign Up
              </button>
              <button
                onClick={loginWithGoogle}
                type="button"
                className="bg-silver py-2 px-4 rounded-lg hover:bg-royal-purple hover:text-white w-full flex gap-2 items-center justify-center"
              >
                <img src={google} alt="Google Logo" />
                Sign Up With Google
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupPage;
