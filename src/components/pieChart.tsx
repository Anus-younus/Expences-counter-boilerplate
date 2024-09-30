"use client";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { useEffect, useState } from "react";

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
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  // Resize handler to adjust chart on window resize
  useEffect(() => {
    // Ensure this code runs only on the client-side
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth); // Set initial width

      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // If windowWidth is null, we are still on the server-side
  if (windowWidth === null) {
    return null; // or a loading spinner
  }

  return (
    <div style={{ maxWidth: windowWidth < 768 ? '100%' : '50%', margin: '0 auto' }}>
      <Pie 
        data={charData} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: windowWidth < 768 ? 'bottom' : 'right',
            },
          },
        }}
        style={{ height: windowWidth < 768 ? '250px' : '400px' }}
      />
    </div>
  );
}
