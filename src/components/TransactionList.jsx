import React, { useContext } from "react";
import TransactionContext from "../context/TransactionContext";
import TransactionCard from "./TransactionCard";

const TransactionList = () => {
  const { transactions } = useContext(TransactionContext);

  const dates = transactions.map((transaction) => {
    return new Date(transaction.date.seconds * 1000).toDateString();
  });

  const dateList = dates.filter((element, index) => {
    return dates.indexOf(element) === index;
  });

  return (
    <div className=" my-4">
      <h1 className="text-xl mb-2">Transaction List</h1>
      <section className="overflow-auto h-96">
        <div className="flex flex-col gap-2">
          {dateList.map((date) => {
            return (
              <div key={date}>
                <div className="py-1 px-4 bg-royal-purple text-white rounded-lg my-2">
                  {date}
                </div>
                <div className="flex flex-col gap-2">
                  {transactions.map((transaction) => {
                    if (
                      new Date(
                        transaction.date.seconds * 1000
                      ).toDateString() == date
                    ) {
                      return (
                        <TransactionCard
                          key={transaction?.id}
                          transaction={transaction}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TransactionList;
