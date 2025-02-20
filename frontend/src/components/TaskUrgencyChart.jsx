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

export default function TaskUrgencyChart() {
	const data = {
		labels: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'],
		datasets: [
			{
				label: 'Task Priority',
				data: [10, 7, 5, 2],
				backgroundColor: ['#FF0000', '#FF8000', '#FFD700', '#FFFF00'],
				borderColor: ['#CC0000', '#CC6600', '#CCAD00', '#CCCC00'],
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { position: 'top' },
			title: { display: true, text: 'Task Priorities' },
		},
		scales: {
			y: { beginAtZero: true },
		},
	};

	return <Bar data={data} options={options} />;
}
