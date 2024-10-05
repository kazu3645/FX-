import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Paper, Text } from '@mantine/core';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function ChartComponent() {
  const [priceData, setPriceData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    // 初期データを生成
    const initialData = Array.from({ length: 100 }, () => Math.random() * 10 + 100);
    setPriceData(initialData);
    setCurrentPrice(initialData[initialData.length - 1]);

    // 1秒ごとに新しい価格を生成
    const interval = setInterval(() => {
      setPriceData(prevData => {
        const newPrice = prevData[prevData.length - 1] + (Math.random() - 0.5) * 0.5;
        setCurrentPrice(newPrice);
        return [...prevData.slice(1), newPrice];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: Array.from({ length: priceData.length }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'USD/JPY',
        data: priceData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'FXチャート',
      },
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <Paper shadow="xs" p="md">
      <Text size="xl" weight={700} align="center" mb="md">現在価格: {currentPrice.toFixed(3)}</Text>
      <Line data={data} options={options} />
    </Paper>
  );
}