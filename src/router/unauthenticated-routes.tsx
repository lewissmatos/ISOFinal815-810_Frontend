import { Navigate, Route, Routes } from "react-router-dom";

const UnauthenticatedRoutes = () => {
	return (
		<Routes>
			<Route path="/*" element={<Navigate to="/login" replace />} />
			<Route path={`/login`} element={"LoginScreen"} />
		</Routes>
	);
};

export default UnauthenticatedRoutes;
