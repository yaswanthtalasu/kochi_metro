import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Train, RiskDistribution } from '../types/train';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskDistributionChartProps {
  trains: Train[];
}

export default function RiskDistributionChart({ trains }: RiskDistributionChartProps) {
  const distribution: RiskDistribution = trains.reduce(
    (acc, train) => {
      acc[train.risk_level]++;
      return acc;
    },
    { Critical: 0, High: 0, Medium: 0, Low: 0 }
  );

  const data = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [distribution.Critical, distribution.High, distribution.Medium, distribution.Low],
        backgroundColor: [
          'rgba(220, 38, 38, 0.8)',
          'rgba(234, 88, 12, 0.8)',
          'rgba(217, 119, 6, 0.8)',
          'rgba(5, 150, 105, 0.8)',
        ],
        borderColor: [
          'rgba(220, 38, 38, 1)',
          'rgba(234, 88, 12, 1)',
          'rgba(217, 119, 6, 1)',
          'rgba(5, 150, 105, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Risk Level Distribution',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}