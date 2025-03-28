import React, { useState, useEffect } from "react";
import TaskUrgencyChart from "./TaskUrgencyChart";
import TaskPriorityChart from "./TaskPriorityChart";
import TaskImpactChart from "./TaskImpactChart";
import Chatbot from "./Chatbot";
import axios from "axios";

export default function AdminDashboard({ userName }) {
	const [ticketData, setTicketData] = useState({
		urgencies: { Critical: 0, High: 0, Medium: 0, Low: 0 },
		priorities: { Highest: 0, High: 0, Medium: 0, Low: 0 },
		impacts: { Enterprise: 0, Department: 0, Team: 0, Individual: 0 }
	});

	async function fetchTicketData() {
		try {
			const response = await axios.get("http://127.0.0.1:8000/tickets");
			setTicketData(response.data);
		} catch (error) {
			console.error("Error fetching ticket data:", error);
		}
	}

	useEffect(() => {
		fetchTicketData();
	}, []);

	return (
		<>
			<header className="topbar">
				<h2>Morning, {userName}!</h2>
			</header>

			<section className="dashboard-cards">
				<div style={{ 'paddingBottom': '60px' }} className="card barchart">
					<h3>Outstanding IT Tickets</h3>
					<TaskUrgencyChart data={ticketData} onRefresh={fetchTicketData} />
				</div>
				<div style={{ 'paddingBottom': '60px' }} className="card barchart">
					<h3>Task Priorities</h3>
					<TaskPriorityChart data={ticketData} onRefresh={fetchTicketData} />
				</div>
				<div style={{ 'paddingBottom': '60px' }} className="card barchart">
					<h3>Task Impact Levels</h3>
					<TaskImpactChart data={ticketData} onRefresh={fetchTicketData} />
				</div>
				<div className="card stats">
					<h3>Congratulations!</h3>
					<div className="chart-value">23</div>
					<p>tickets closed this week.</p>
				</div>
				<div className="card chainlit">
					<Chatbot />
				</div>
				<div className="card stats">
					<h3>Project at Risk</h3>
					<p>Laptop OS Update</p>
					<p>8 Days Delay</p>
				</div>
			</section>
		</>
	);
};
