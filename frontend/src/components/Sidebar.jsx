
export default function Sidebar() {
	return (
		<aside class="sidebar">
			<div className="sidebar-header">
				<h2>🚀 purpose</h2>
			</div>
			<div className="user-profile">
				<h3>Heather Parker</h3>
				<p>Web Architect</p>
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
