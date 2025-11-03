import { HeroUIProvider, ToastProvider } from "@heroui/react";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import AuthenticatedRoutes from "./router/authenticated-routes";
import UnauthenticatedRoutes from "./router/unauthenticated-routes";

function App() {
	const isAuthenticated = true;
	return (
		<BrowserRouter basename={import.meta.env.VITE_REACT_APP_URL_BASE}>
			<HeroUIProvider>
				<main
					className={`app-light text-foreground bg-background p-0 transition-all duration-100 selection:bg-primary-200 selection:text-primary-600`}
				>
					<ToastProvider placement="bottom-right" maxVisibleToasts={3} />

					{isAuthenticated ? (
						<AuthenticatedRoutes />
					) : (
						<UnauthenticatedRoutes />
					)}
				</main>
			</HeroUIProvider>
		</BrowserRouter>
	);
}

export default App;
