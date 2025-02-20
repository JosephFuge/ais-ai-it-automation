import React from "react";
import TaskList from "./TaskList";
import TaskUrgencyChart from "./TaskUrgencyChart";
import Chatbot from "./Chatbot";

export default function AdminDashboard() {
	const firstName = "Ryan";
	const lastName = "Snow";
	return (
		<>
			<header className="topbar">
				<h2>Morning, {firstName}!</h2>
				<p>Have a nice day!</p>
				<div className="user-info">
					<span>{firstName} {lastName}</span>
				</div>
			</header>

			<section className="dashboard-cards">
				<div className="card barchart">
					<h3>Outstanding IT Tickets</h3>
					<TaskUrgencyChart />
				</div>
				<div className="card chainlit">
					<Chatbot />
				</div>
				<div className="card stats">
					<h3>Congratulations!</h3>
					<div className="chart-value">23</div>
					<p>GitHub issues closed this week.</p>
				</div>
				<div className="card stats">
					<h3>Project at Risk</h3>
					<p>Website Redesign</p>
					<p>8 Days Delay</p>
				</div>
				<div className="card task-list">
					<TaskList />
				</div>
			</section>
		</>
	);
};
