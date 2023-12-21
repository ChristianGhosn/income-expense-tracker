import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { useAuth } from "./AuthContext";
import { db } from "../config/firebase";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!user) {
      return navigate("/login");
    }
    try {
      const transactionsCollection = collection(db, "transactions");
      const categoriesCollection = collection(db, "categories");

      const q = query(
        transactionsCollection,
        where("user", "==", user.uid),
        orderBy("date", "desc")
      );
      const transactionsSnapshot = await getDocs(q);

      let transactions = transactionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const categoriesSnapshot = await getDocs(categoriesCollection);

      const categories = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      transactions = transactions.map((transaction) => {
        for (let category of categories) {
          if (transaction.category === category.id) {
            console.log({ ...transaction, category });
            return { ...transaction, category };
          }
        }
      });
      console.log(transactions);
      setTransactions(transactions);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchDataOnMount = async () => {
      try {
        await fetchData();
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching data");
        console.log(error.message);
      }
    };

    fetchDataOnMount();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const addTransaction = async (data) => {
    setLoading(true);
    try {
      const transactionsCollection = collection(db, "transactions");
      const docRef = await addDoc(transactionsCollection, data);
      fetchData();
      setLoading(false);
      toast.success("New transaction added");
    } catch (error) {
      toast.error("Error adding document");
      console.log(error.message);
    }
  };

  const deleteTransaction = async (id) => {
    setLoading(true);
    const updatedData = transactions.filter((expense) => {
      if (expense.id != id) {
        return expense;
      }
    });
    setTransactions(updatedData);
    try {
      const docRef = doc(db, "transactions", id);
      deleteDoc(docRef).then(() => {
        toast.success(`Document deleted`);
      });
      setLoading(false);
    } catch (error) {
      toast.error("Error deleting document");
      console.log(error);
    }
  };

  const calculateMonthlyIncome = () => {
    const monthlyIncomeArray = [];
    for (let month = 0; month <= 11; month++) {
      const monthlyTransactionsIncomeArray = transactions.map((transaction) => {
        const monthOfTransaction = new Date(
          transaction.date.seconds * 1000
        ).getMonth();

        if (transaction.amount > 0 && monthOfTransaction == month) {
          return Number(transaction.amount);
        } else {
          return 0;
        }
      });
      const monthlyIncomeTotal = monthlyTransactionsIncomeArray.reduce(
        (acc, current) => {
          return acc + current;
        },
        0
      );
      monthlyIncomeArray.push(monthlyIncomeTotal);
    }
    return monthlyIncomeArray;
  };

  const calculateMonthlyOutgoings = () => {
    const monthlyOutgoingsArray = [];
    for (let month = 0; month <= 11; month++) {
      const monthlyTransactionsOutgoingsArray = transactions.map(
        (transaction) => {
          const monthOfTransaction = new Date(
            transaction.date.seconds * 1000
          ).getMonth();

          if (transaction.amount < 0 && monthOfTransaction == month) {
            return Math.abs(Number(transaction.amount));
          } else {
            return 0;
          }
        }
      );
      const monthlyOutgoingsTotal = monthlyTransactionsOutgoingsArray.reduce(
        (acc, current) => {
          return acc + current;
        },
        0
      );
      monthlyOutgoingsArray.push(monthlyOutgoingsTotal);
    }
    return monthlyOutgoingsArray;
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        addTransaction,
        deleteTransaction,
        calculateMonthlyIncome,
        calculateMonthlyOutgoings,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionContext;
