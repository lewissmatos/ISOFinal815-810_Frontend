import { Outlet } from "react-router-dom";
import AppSidebar from "./app-sidebar";

const AuthenticatedLayout = () => {
	return (
		<div className="transition-all flex flex-row flex-1 overflow-auto h-screen">
			<AppSidebar />
			<div className="flex-1 overflow-auto">
				<Outlet />
			</div>
		</div>
	);
};

export default AuthenticatedLayout;
