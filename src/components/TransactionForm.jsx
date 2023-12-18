import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAuth } from "../context/AuthContext";
import TransactionContext from "../context/TransactionContext";
import calculateTax from "../utils/CalculateTax";
import { ThreeDots } from "react-loader-spinner";

const inputClasses =
  "w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-royal-purple text-sm";

const TransactionForm = () => {
  const { user } = useAuth();
  const { addTransaction, loading } = useContext(TransactionContext);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const tax = calculateTax(amount);
    const data = {
      user: user.uid,
      name,
      amount,
      date: new Date(date),
      category,
      tax,
    };
    addTransaction(data);
    setName("");
    setAmount("");
    setDate("");
    setCategory("");
  };

  return (
    <div>
      {loading && (
        <div className="h-48 w-full flex justify-center items-center">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#8F659A"
            ariaLabel="three-dots-loading"
            visible={loading}
          />
        </div>
      )}
      {!loading && (
        <>
          <h1 className="text-xl">New Transaction</h1>
          <form
            onSubmit={onSubmit}
            className="flex gap-2 flex-col items-center justify-center w-full"
          >
            <fieldset
              disabled={loading}
              className="flex gap-2 flex-wrap w-full"
            >
              <input
                type="text"
                placeholder="Name..."
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
              />
              <input
                type="number"
                placeholder="Amount..."
                value={amount}
                name="amount"
                onChange={(e) => setAmount(e.target.value)}
                className={inputClasses}
              />
              <DatePicker
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                placeholderText="DD/MM/YYYY"
                className={inputClasses}
              />
              <input
                type="text"
                placeholder="Category..."
                value={category}
                name="category"
                onChange={(e) => setCategory(e.target.value)}
                className={inputClasses}
              />
            </fieldset>
            <button
              type="submit"
              className="bg-silver py-1.5 px-4 rounded-lg hover:bg-royal-purple hover:text-white w-full"
            >
              Add
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default TransactionForm;
