import React, { useContext, useState } from "react";

import toast from "react-hot-toast";
import Joi from "joi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAuth } from "../context/AuthContext";
import TransactionContext from "../context/TransactionContext";
import calculateTax from "../utils/CalculateTax";
import validateForm from "../utils/ValidateForm";
import Loader from "./Loader";
import Input from "./Input";
import CategoryCombobox from "./CategoryCombobox";

const TransactionForm = () => {
  const { user } = useAuth();
  const { addTransaction, loading } = useContext(TransactionContext);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState({});
  const [errors, setErrors] = useState({});

  const inputClasses = `w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-royal-purple text-sm`;
  const inputClassesErrors = "ring-red-400";

  const schema = Joi.object({
    user: Joi.string().required(),
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name is empty",
    }),
    amount: Joi.number().integer().invalid(0.0).required().messages({
      "*": "Amount should not be 0",
    }),
    date: Joi.date().required().messages({
      "*": "Date is empty",
    }),
    category: Joi.string().required().messages({
      "any.required": "Category is required",
      "string.empty": "Category is empty",
    }),
    tax: Joi.string().invalid("0").required().messages({
      "number.not": "Tax should not be 0",
      "any.required": "Tax is required",
    }),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const tax = calculateTax(amount);

    const data = {
      user: user.uid,
      name,
      amount: Number(amount),
      date: new Date(date),
      category: category.id,
      tax: tax.toString(),
    };

    const errorData = validateForm(data, schema);
    if (errorData) {
      toast.error("Missing or incorrect fields!");
      return setErrors(errorData);
    }

    addTransaction(data);
    setErrors({});
    setName("");
    setAmount("");
    setDate("");
    setCategory("");
  };

  return (
    <div>
      {loading && <Loader />}
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
              <Input
                type="text"
                placeholder="Name..."
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                errors={errors}
              />
              <Input
                type="number"
                placeholder="Amount... (use '-' for Outgoings)"
                value={amount}
                name="amount"
                onChange={(e) => setAmount(e.target.value)}
                errors={errors}
              />
              <DatePicker
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                placeholderText="DD/MM/YYYY"
                className={`${inputClasses} ${
                  errors["date"] && inputClassesErrors
                }`}
              />
              {errors["date"] && (
                <span className="text-xs text-red-400">{errors["date"]}</span>
              )}
              <CategoryCombobox
                selectedCategory={category}
                setSelectedCategory={setCategory}
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
