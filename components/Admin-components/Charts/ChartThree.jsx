"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';
import { FaDownload } from 'react-icons/fa';

ChartJS.register(Filler, ArcElement, Tooltip, Legend);

const ChartThree = ({ chartData }) => {
  const chartRef = useRef(null); // Reference to the chart
  const t = useTranslations("admin-dashboard");
  const {
    sidebarHide,
    setSidebarHide,
    updateCard,
    setUpdateCard,
    changeTable,
    setChangeTable,
    userData,
    dataDashboard,
    isDarkMode,
    setIsDarkMode
  } = useContext(AdminDashboardContext);

  const [meta, setMeta] = useState(0);
  const [google, setGoogle] = useState(0);
  const [tiktok, setTiktok] = useState(0);

  useEffect(() => {
    setMeta(chartData.donut);
    setGoogle(chartData.donut2);
    setTiktok(chartData.donut3);
  }, [chartData]);

  const data = {
    labels: ["Meta", "Google", "Tiktok"],
    datasets: [
      {
        label: 'Campaign',
        data: [meta, google, tiktok],
        backgroundColor: [
          '#3B82F6',
          '#C7D2FE',
          '#1C1917',
        ],
        borderColor: [
          '#2563EB',
          '#A5B4FC',
          '#0C0A09',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its parent container
    cutout: `${100 - 40}%`,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? "white" : "gray",
          boxWidth: 20, // Control the width of the color box in the legend
          padding: 30, // Change legend text color
        },
      },
      title: {
        display: true,
        text: 'Campaign Platform',
        color: isDarkMode ? "white" : "gray",
        padding: {
          top: 10, // Adjust top padding to control the distance between the title and the top of the chart
          bottom: 30, // Adjust bottom padding to control the distance between the title and the legend
        },
      },
    },
    scales: {
      x: {
        display: false, // Hide X-axis
        grid: {
          display: false, // Hide X-axis grid lines
        },
      },
      y: {
        display: false, // Hide Y-axis
        grid: {
          display: false, // Hide Y-axis grid lines
        },
      },
    },
  };

  const downloadChart = () => {
    const chart = chartRef.current;
    const link = document.createElement('a');
    link.href = chart.toBase64Image();
    link.download = 'platform-report.png';
    link.click();
  };

  return (
    <div className="relative w-full h-96"> {/* Parent container with a fixed height */}
      <Doughnut ref={chartRef} data={data} options={options} />
      <div
        className="absolute top-7 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={downloadChart}
      >
        <FaDownload className={`${isDarkMode ? "text-white" : "text-gray-500"} text-lg`} />
      </div>
    </div>
  );
};

export default ChartThree;
