// PieChart.tsx
"use client";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale, // You don't actually need this for a pie chart
  ArcElement,  // Import ArcElement for pie charts
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend); // Remove PointElement and PiearScale

export default function PieChart({ charData }: any) {
    return (
        <>
          <Pie data={charData} />
        </>
    );
}
