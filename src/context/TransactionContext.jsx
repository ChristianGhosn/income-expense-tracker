import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
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
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) {
      return navigate("/login");
    }
    try {
      const transactionsCollection = collection(db, "transactions");
      const q = query(
        transactionsCollection,
        where("user", "==", user.uid),
        orderBy("date", "desc")
      );
      const snapshot = await getDocs(q);

      const transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(transactions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDataOnMount = async () => {
      try {
        await fetchData();
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchDataOnMount();

    return () => {
      // Cleanup function: Set isMounted to false when the component is unmounted
      isMounted = false;
    };
  }, [user]);

  const addTransaction = async (data) => {
    try {
      const transactionsCollection = collection(db, "transactions");
      const docRef = await addDoc(transactionsCollection, data);
      fetchData();
      console.log("Document written: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const deleteTransaction = async (id) => {
    const updatedData = transactions.filter((expense) => {
      if (expense.id != id) {
        return expense;
      }
    });
    setTransactions(updatedData);
    try {
      const docRef = doc(db, "transactions", id);
      deleteDoc(docRef).then(() => {
        console.log("Document ", id, " deleted");
      });
    } catch (error) {
      console.error(error);
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
