import React, { useState, useEffect } from 'react';
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
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TaskUrgencyChart() {
	const [urgencyCounts, setUrgencyCounts] = useState([0, 0, 0, 0]);

	async function getTicketUrgencies() {
		const response = await axios.get("http://127.0.0.1:8000/tickets");
		const urgencies = response.data;
		setUrgencyCounts([urgencies['Critical'], urgencies['High'], urgencies['Medium'], urgencies['Low']]);
	}

	useEffect(() => {
		console.log('RUNNING');
		getTicketUrgencies();
	}, []);


	const data = {
		labels: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
		datasets: [
			{
				label: 'Ticket Priority',
				data: urgencyCounts,
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
			title: { display: true, text: 'Ticket Priorities' },
		},
		scales: {
			y: { beginAtZero: true },
		},
	};

	return (<div style={{ 'justify-items': 'center' }}>
		<Bar data={data} options={options} />
		<button style={{ 'width': '150px', 'marginTop': '16px' }} type="action" onClick={getTicketUrgencies}>Refresh</button>
	</div>);
}
