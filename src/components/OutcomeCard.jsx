import React, { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
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
import Loader from "./Loader";

Chart.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

const OutcomeCard = () => {
  const { calculateMonthlyIncome, calculateMonthlyOutgoings, loading } =
    useContext(TransactionContext);

  const [incomeData, setIncomeData] = useState([]);
  const [outgoingsData, setOutgoingsData] = useState([]);

  useEffect(() => {
    setIncomeData(calculateMonthlyIncome());
    setOutgoingsData(calculateMonthlyOutgoings());
  }, [calculateMonthlyIncome, calculateMonthlyOutgoings]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="my-4 w-full h-full">
      <h1 className="text-xl">Monthly Breakdown</h1>
      <div className="h-full">
        <Bar
          height="220px"
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
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    return `$${tooltipItem.formattedValue}`;
                  },
                },
              },
            },
            scales: {
              y: {
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          }}
        />
      </div>
    </section>
  );
};

export default OutcomeCard;
