import React from "react";
import TransactionList from "../components/TransactionList";
import OutcomeCard from "../components/OutcomeCard";
import WelcomeCard from "../components/WelcomeCard";
import TransactionForm from "../components/TransactionForm";

const HomePage = () => {
  return (
    <div className="p-4 grid lg:grid-cols-2 grid-cols-1 gap-4">
      <div className="w-full h-full">
        <WelcomeCard />
        <OutcomeCard />
      </div>
      <div>
        <TransactionForm />
        <TransactionList />
      </div>
    </div>
  );
};

export default HomePage;
