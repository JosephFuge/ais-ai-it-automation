
export default function Sidebar({ userName, onLogout }) {
	return (
		<aside className="sidebar">
			<div className="sidebar-header">
				<img src="https://seo.nlx.org/southernco/img/logo.svg" alt="SouthernCompany Logo" />
			</div>
			<div className="user-profile">
				<h3>{userName ?? 'Ryan Snow'}</h3>
				<p>IT Systems Administrator</p>
				<button onClick={() => onLogout()} className="button">Log Out</button>
			</div>
			<nav className="menu">
				<a href="#" className="active">🏠 Home</a>
				<a href="https://it-automation-challenge.atlassian.net/jira/servicedesk/projects/SC/queues">✅ Tickets</a>
			</nav>
		</aside >
	);
}
