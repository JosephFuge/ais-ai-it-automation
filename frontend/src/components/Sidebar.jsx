
export default function Sidebar({ userName }) {
	return (
		<aside class="sidebar">
			<div className="sidebar-header">
				<img src="https://seo.nlx.org/southernco/img/logo.svg" alt="SouthernCompany Logo" />
				<h2>Southern Company</h2>
			</div>
			<div className="user-profile">
				<h3>{userName ?? 'Ryan Snow'}</h3>
				<p>IT Systems Administrator</p>
				<button className="balance-btn">$2,300</button>
			</div>
			<nav className="menu">
				<a href="#" class="active">🏠 Home</a>
				<a href="#">📂 Projects</a>
				<a href="#">✅ Tickets</a>
				<a href="#">📌 Kanban</a>
				<a href="#">👥 Users</a>
				<a href="#">🔧 Profile</a>
			</nav>
		</aside>
	);
}
