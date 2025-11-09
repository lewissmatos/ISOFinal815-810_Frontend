import { Navigate, Route, Routes } from "react-router-dom";
import { useAtomValue } from "jotai";
import LoginScreen from "../features/auth/login-screen";
import { isAuthenticatedAtom } from "../atoms/auth.atom";
import useSystemRouter from "../hooks/useSystemRouter";

const UnauthenticatedRoutes = () => {
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);
	const { getHomePath } = useSystemRouter();

	if (isAuthenticated) {
		const homePath = getHomePath();
		return <Navigate to={`/${homePath}`} replace />;
	}

	return (
		<Routes>
			<Route path="/login" element={<LoginScreen />} />
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
};

export default UnauthenticatedRoutes;
