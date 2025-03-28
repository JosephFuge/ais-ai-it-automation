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

const labels = {
    '1h': ['1h ago', '45m ago', '30m ago', '15m ago', 'Now'],
    '4h': ['4h ago', '2h ago', '1h ago', '30m ago', 'Now'],
    '8h': ['8h ago', '4h ago', '2h ago', '1h ago', 'Now'],
    '12h': ['12h ago', '6h ago', '3h ago', '1h ago', 'Now'],
    '24h': ['24h ago', '12h ago', '6h ago', '3h ago', 'Now'],
}

export default function TaskStatusChart({ 
    data, 
    onRefresh, 
    timeframe, 
    onTimeframeChange 
}) {
    const chartData = {
        labels: labels[timeframe],
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
        maintainAspectRatio: false,
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
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
            }}>
                <h4 style={{ margin: 0 }}>Task Status</h4>
                <select 
                    value={timeframe} 
                    onChange={(e) => onTimeframeChange(e.target.value)}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                >
                    <option value="1h">Last Hour</option>
                    <option value="4h">Last 4 Hours</option>
                    <option value="8h">Last 8 Hours</option>
                    <option value="12h">Last 12 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                </select>
            </div>
            <div style={{ 
                flex: 1, 
                position: 'relative', 
                width: '100%',
                minHeight: 0 
            }}>
                <Line data={chartData} options={options} />
            </div>
            {/* <button 
                style={{ 
                    width: '150px', 
                    marginTop: '16px',
                    alignSelf: 'center'
                }} 
                type="button" 
                onClick={onRefresh}
            >
                Refresh
            </button> */}
        </div>
    );
}