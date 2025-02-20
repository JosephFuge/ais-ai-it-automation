import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout({ userName }) {
	return (
		<div className="dashboard">
			<Sidebar userName={userName} />
			<main className="content">
				<Outlet />
			</main>
		</div>
	);
};
