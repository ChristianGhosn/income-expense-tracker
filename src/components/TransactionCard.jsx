import React, { useContext } from "react";
import { XCircle } from "lucide-react";
import TransactionContext from "../context/TransactionContext";

const TransactionCard = ({ transaction }) => {
  const { deleteTransaction } = useContext(TransactionContext);

  const deletetransaction = () => {
    deleteTransaction(transaction.id);
  };

  return (
    <div className="w-full bg-silver flex gap-6 items-center p-4 rounded-lg">
      <div>Icon</div>
      <div className="w-full">
        <div className="flex justify-between">
          <h4>{transaction.name}</h4>
          <h4>
            {transaction.amount > 0 ? "" : "-"}${Math.abs(transaction.amount)}
          </h4>
        </div>
        <div className="flex justify-between">
          <p>{transaction?.category}</p>
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
