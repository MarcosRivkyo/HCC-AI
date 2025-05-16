import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface BarChartProps {
  probabilities: number[];
  labels: string[];
  theme: string;
}

const BarChart: React.FC<BarChartProps> = ({
  probabilities,
  labels,
  theme,
}) => {
  const isDark = theme === "dark";

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Probabilities",
        data: probabilities,
        backgroundColor: isDark
          ? "rgba(100, 181, 246, 0.6)"
          : "rgba(255, 159, 64, 0.6)",
        borderColor: isDark
          ? "rgba(100, 181, 246, 1)"
          : "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDark ? "#ffffff" : "#000000",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Probability: ${context.raw.toFixed(4)}`,
        },
        backgroundColor: isDark ? "#333" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
      },
      title: {
        display: true,
        text: "",
        color: isDark ? "#ffffff" : "#000000",
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#ffffff" : "#000000",
        },
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          color: isDark ? "#ffffff" : "#000000",
        },
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
