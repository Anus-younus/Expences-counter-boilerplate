// PieChart.tsx
"use client";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register the necessary components
ChartJS.register(ArcElement, Title, Tooltip, Legend); 

// Define an interface for the dataset
interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderWidth: number;
}

// Define an interface for userData
interface UserData {
  labels: string[];
  datasets: Dataset[];
}

// Define the props interface for the PieChart component
interface PieChartProps {
  charData: UserData;
}

export default function PieChart({ charData }: PieChartProps) {
    return (
        <>
          <Pie data={charData} />
        </>
    );
}
