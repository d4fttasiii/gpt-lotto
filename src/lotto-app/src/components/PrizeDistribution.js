import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PrizeDistribution = () => {
  const data = {
    labels: [
      '6 correct guesses',
      '5 correct guesses',
      '4 correct guesses',
      '3 correct guesses',
      '2 correct guesses',
      '1 correct guesses',
      'Contract Owner',
      'Token Holder Rewards'
    ],
    datasets: [
      {
        data: [40, 25, 10, 5, 3, 2, 10, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#15803d', '#0e7490', '#6d28d9', '#b91c1c', '#44403c'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#15803d', '#0e7490', '#6d28d9', '#b91c1c', '#44403c'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataset = context.chart.data.datasets[context.datasetIndex];
            const total = dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue);
            const currentValue = dataset.data[context.dataIndex];
            const percentage = Math.round((currentValue / total) * 100);
            return `  ${percentage}%`;
          }
        }
      }
    },
  };

  return (
    <div className="flex justify-center items-center" style={{ maxHeight: "500px" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PrizeDistribution;
