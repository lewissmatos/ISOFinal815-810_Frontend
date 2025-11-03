import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { AppAtomsGate } from "./atoms/app-atoms-gate.tsx";
import getQueryClient from "./lib/getQueryClient.ts";
import { QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={getQueryClient()}>
			<AppAtomsGate>
				<App />
			</AppAtomsGate>
		</QueryClientProvider>
	</StrictMode>
);
