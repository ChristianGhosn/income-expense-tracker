import React, { useContext, useState } from "react";

import toast from "react-hot-toast";
import Joi from "joi";
import { ThreeDots } from "react-loader-spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAuth } from "../context/AuthContext";
import TransactionContext from "../context/TransactionContext";
import calculateTax from "../utils/CalculateTax";

const TransactionForm = () => {
  const { user } = useAuth();
  const { addTransaction, loading } = useContext(TransactionContext);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [errorData, setErrorData] = useState({});

  const inputClasses = `w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-royal-purple text-sm`;
  const inputClassesErrors = "ring-red-400";

  const schema = Joi.object({
    user: Joi.string().required(),
    name: Joi.string().alphanum().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name is empty",
    }),
    amount: Joi.number().invalid(0).required().messages({
      "*": "Amount should not be 0",
    }),
    date: Joi.date().required().messages({
      "*": "Date is empty",
    }),
    category: Joi.string().required().messages({
      "any.required": "Category is required",
      "string.empty": "Category is empty",
    }),
    tax: Joi.number().greater(0).less(0).required().messages({
      "number.less": "Tax should not be 0",
      "number.greater": "Tax should not be 0",
      "number.required": "Tax is required",
    }),
  });

  const validateForm = (data) => {
    const { value, error } = schema.validate(data, { abortEarly: false });

    if (!error) {
      return console.log("Form valid");
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
        console.log(errorData[name]);
      }
      return errorData;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const tax = calculateTax(amount);
    const data = {
      user: user.uid,
      name,
      amount: Number(amount),
      date: new Date(date),
      category,
      tax,
    };
    const errorData = validateForm(data);
    if (errorData) {
      toast.error("Missing or incorrect fields!");
      return setErrorData(errorData);
    }

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
                className={`${inputClasses} ${
                  errorData["name"] && inputClassesErrors
                }`}
              />
              {errorData["name"] && (
                <span className="text-xs text-red-400">
                  {errorData["name"]}
                </span>
              )}
              <input
                type="number"
                placeholder="Amount... (use '-' for Outgoings)"
                value={amount}
                name="amount"
                onChange={(e) => setAmount(e.target.value)}
                className={`${inputClasses} ${
                  errorData["amount"] && inputClassesErrors
                }`}
              />
              {errorData["amount"] && (
                <span className="text-xs text-red-400">
                  {errorData["amount"]}
                </span>
              )}
              <DatePicker
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                placeholderText="DD/MM/YYYY"
                className={`${inputClasses} ${
                  errorData["date"] && inputClassesErrors
                }`}
              />
              {errorData["date"] && (
                <span className="text-xs text-red-400">
                  {errorData["date"]}
                </span>
              )}
              <input
                type="text"
                placeholder="Category..."
                value={category}
                name="category"
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputClasses} ${
                  errorData["category"] && inputClassesErrors
                }`}
              />
              {errorData["category"] && (
                <span className="text-xs text-red-400">
                  {errorData["category"]}
                </span>
              )}
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
