import React, { useState, useEffect } from "react";
import TaskUrgencyChart from "./Charts/TaskUrgencyChart";
import TaskPriorityChart from "./Charts/TaskPriorityChart";
import TaskImpactChart from "./Charts/TaskImpactChart";
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
					<h3 style={{ 'textAlign': 'center' }}>Outstanding IT Tickets</h3>
					<TaskUrgencyChart data={ticketData}/>
				</div>
				<div style={{ 'paddingBottom': '60px' }} className="card barchart">
					<h3 style={{ 'textAlign': 'center' }}>Task Priorities</h3>
					<TaskPriorityChart data={ticketData}/>
				</div>
				<div style={{ 'paddingBottom': '60px' }} className="card barchart">
					<h3 style={{ 'textAlign': 'center' }}>Task Impact Levels</h3>
					<TaskImpactChart data={ticketData}/>
				</div>
			</section>
			<div style={{ 'gridColumn': '1 / -1', 'textAlign': 'center', 'marginTop': '20px' }}>
				<button type="button" className="button blue-pill" onClick={fetchTicketData}>Refresh</button>
			</div>
				<h1 style={{ 'textAlign': 'center', 'marginTop': '196px' }}>
					Ticket Support
				</h1>
			<section className="dashboard-cards">
				<div></div>
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
