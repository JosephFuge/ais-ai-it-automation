import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function TaskStatusChart({ data, onRefresh }) {
    const chartData = {
        labels: ['1h ago', '45m ago', '30m ago', '15m ago', 'Now'],
        datasets: [
            {
                label: 'Running Tasks',
                data: data.running || [0, 0, 0, 0, 0],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Failing Tasks',
                data: data.failing || [0, 0, 0, 0, 0],
                borderColor: '#F44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Important for controlling chart size
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Task Status Over Time' },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Tasks'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            }
        },
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', 
            width: '100%',
            overflow: 'hidden' 
        }}>
            <div style={{ 
                flex: 1, 
                position: 'relative', 
                width: '100%',
                minHeight: 0 // Ensures the chart can shrink
            }}>
                <Line data={chartData} options={options} />
            </div>
            <button 
                style={{ 
                    width: '150px', 
                    marginTop: '16px',
                    alignSelf: 'center'
                }} 
                type="button" 
                onClick={onRefresh}
            >
                Refresh
            </button>
        </div>
    );
}