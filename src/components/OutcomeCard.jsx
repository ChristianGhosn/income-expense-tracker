import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Chart,
  Legend,
  Tooltip,
} from "chart.js";

import TransactionContext from "../context/TransactionContext";

Chart.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

const OutcomeCard = () => {
  const { calculateMonthlyIncome, calculateMonthlyOutgoings } =
    useContext(TransactionContext);

  const [incomeData, setIncomeData] = useState([]);
  const [outgoingsData, setOutgoingsData] = useState([]);

  useEffect(() => {
    setIncomeData(calculateMonthlyIncome());
    setOutgoingsData(calculateMonthlyOutgoings());
  }, [calculateMonthlyIncome, calculateMonthlyOutgoings]);

  return (
    <section className="my-4">
      <h1 className="text-xl">Monthly Breakdown</h1>
      <Bar
        data={{
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Income",
              data: incomeData,
              backgroundColor: "green",
              borderColor: "black",
              borderWidth: 1,
            },
            {
              label: "Outgoings",
              data: outgoingsData,
              backgroundColor: "red",
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        }}
      />
    </section>
  );
};

export default OutcomeCard;
