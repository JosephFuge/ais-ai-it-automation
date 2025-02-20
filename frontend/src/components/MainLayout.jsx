import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout({ userName, onLogout }) {
	return (
		<div className="dashboard">
			<Sidebar userName={userName} onLogout={onLogout} />
			<main className="content">
				<Outlet />
			</main>
		</div>
	);
};
