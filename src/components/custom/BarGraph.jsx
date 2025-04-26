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


export default function BarGraph({ labels, yLabelVisible=true }) {

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false, // Hide the legend
            },
        },
        scales: {
            y: {
                ticks: {
                    display: yLabelVisible, // Hide Y-axis labels
                },
                grid: {
                    display: true, // Hide Y-axis grid lines
                },
            },
            x: {
                grid: {
                    display: false, // Hide X-axis grid lines
                },
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset',
                data: labels.map(() => Math.floor(Math.random() * 1001)), // Generating random number between 0 and 1000
                backgroundColor: '#48ABB8',
            },
        ],
    };

    return <Bar options={options} data={data} />;
}