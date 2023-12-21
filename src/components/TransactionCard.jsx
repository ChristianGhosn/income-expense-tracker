import React, { useContext } from "react";
import { XCircle } from "lucide-react";

import { Icon } from "./Icon";
import TransactionContext from "../context/TransactionContext";

const TransactionCard = ({ transaction }) => {
  const { deleteTransaction } = useContext(TransactionContext);

  const deletetransaction = () => {
    deleteTransaction(transaction.id);
  };

  return (
    <div className="relative w-full bg-silver flex gap-6 items-center p-4 z-0 rounded-lg overflow-hidden">
      <div
        className={`absolute inset-y-0 left-0 w-2 ${
          transaction.amount > 0 ? "bg-green-600" : "bg-red-600"
        } `}
      />
      <Icon name={transaction?.category?.icon} />
      <div className="w-full">
        <div className="flex justify-between">
          <h4>{transaction.name}</h4>
          <h4>
            {transaction.amount > 0 ? "" : "-"}${Math.abs(transaction.amount)}
          </h4>
        </div>
        <div className="flex justify-between">
          <p>{transaction?.category?.label}</p>
          <p>Tax: ${transaction?.tax}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={deletetransaction}>
          <XCircle size={20} className="hover:stroke-royal-purple" />
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;
