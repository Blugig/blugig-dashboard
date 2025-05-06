"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BarGraph({ labels, acceptedData, rejectedData, pendingData, yLabelVisible = true }) {
    const options = {
        indexAxis: 'y', // ✅ Switch to horizontal bars
        responsive: true,
        plugins: {
            title: { display: false },
            legend: { display: true },
        },
        scales: {
            x: {
                stacked: true, // ✅ Horizontal stacking
                grid: { display: true },
            },
            y: {
                stacked: true,
                ticks: { display: yLabelVisible },
                grid: { display: false },
            },
        },
    };


    const data = {
        labels,
        datasets: [
            {
                label: 'Accepted',
                data: acceptedData,
                backgroundColor: '#48ABB8',
            },
            {
                label: 'Rejected',
                data: rejectedData,
                backgroundColor: '#F87171',
            },
            {
                label: 'Pending',
                data: pendingData,
                backgroundColor: '#FBBF24',
            },
        ],
    };

    return <Bar options={options} data={data} />;
}
