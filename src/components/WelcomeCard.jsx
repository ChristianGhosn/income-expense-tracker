import React from "react";
import { useAuth } from "../context/AuthContext";

const WelcomeCard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-5xl">Hello, {user?.displayName}</h1>
    </div>
  );
};

export default WelcomeCard;
