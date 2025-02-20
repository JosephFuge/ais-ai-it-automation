import React from "react";
import TaskList from "./TaskList";
import TaskUrgencyChart from "./TaskUrgencyChart";
import Chatbot from "./Chatbot";

export default function AdminDashboard({ userName }) {
	return (
		<>
			<header className="topbar">
				<h2>Morning, {userName}!</h2>
			</header>

			<section className="dashboard-cards">
				<div style={{ 'paddingBottom': '60px' }} className="card barchart">
					<h3>Outstanding IT Tickets</h3>
					<TaskUrgencyChart />
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
				<div className="card task-list">
					<TaskList />
				</div>
			</section>
		</>
	);
};
