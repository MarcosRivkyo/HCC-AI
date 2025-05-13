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
  labels: string[]; // <- Aceptar etiquetas dinámicas
}

const BarChart: React.FC<BarChartProps> = ({ probabilities, labels }) => {
  const data = {
    labels: labels, // <- Usar directamente las etiquetas proporcionadas
    datasets: [
      {
        label: "Probabilidades",
        data: probabilities,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Probabilidad: ${context.raw.toFixed(4)}`,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
