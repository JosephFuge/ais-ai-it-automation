import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TaskImpactChart({ data }) {
    console.log(JSON.stringify(data));
    const impactCounts = [
        data.impacts['Minor / Localized'] || 0,
        data.impacts['Moderate / Limited'] || 0,
        data.impacts['Significant / Large'] || 0,
        data.impacts['Extensive / Widespread'] || 0
    ];

    const chartData = {
        labels: ['MINOR', 'MODERATE', 'SIGNIFICANT', 'EXTENSIVE'],
        datasets: [
            {
                label: 'Impact Level',
                data: impactCounts,
                backgroundColor: ['#FF0000', '#FF8000', '#FFD700', '#FFFF00'],
                borderColor: ['#CC0000', '#CC6600', '#CCAD00', '#CCCC00'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
} 