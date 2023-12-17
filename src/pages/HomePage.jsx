import React from "react";
import TransactionList from "../components/TransactionList";
import OutcomeCard from "../components/OutcomeCard";
import WelcomeCard from "../components/WelcomeCard";
import TransactionForm from "../components/TransactionForm";

const HomePage = () => {
  return (
    <div className="p-4">
      <WelcomeCard />
      <OutcomeCard />
      <TransactionForm />
      <TransactionList />
    </div>
  );
};

export default HomePage;
