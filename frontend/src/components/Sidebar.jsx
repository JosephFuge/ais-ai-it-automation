import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ userName, onLogout }) {
	const location = useLocation();

	return (
		<aside className="sidebar">
			<div className="sidebar-header">
				<img src="https://seo.nlx.org/southernco/img/logo.svg" alt="SouthernCompany Logo" />
			</div>
			<div className="user-profile">
				<h3>{userName ?? 'Ryan Snow'}</h3>
				<p>IT Systems Administrator</p>
				<button onClick={() => onLogout()} className="button blue-pill">Log Out</button>
			</div>
			<nav className="menu">
				<Link to="/" className={location.pathname === "/" ? "active" : ""}>🏠 Home</Link>
				<a href="https://it-automation-challenge.atlassian.net/jira/servicedesk/projects/SC/queues">✅ Tickets</a>
				<Link to="/routine-tasks" className={location.pathname === "/routine-tasks" ? "active" : ""}>⚙️ Routine Tasks</Link>
			</nav>
		</aside>
	);
}
