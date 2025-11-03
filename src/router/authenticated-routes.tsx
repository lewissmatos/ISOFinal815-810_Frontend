import { Navigate, Route, Routes } from "react-router-dom";
import useSystemRouter from "../hooks/useSystemRouter";
import AuthenticatedLayout from "../components/ui/authenticated-layout";

const AuthenticatedRoutes = () => {
	const { getRoutes, getHomePath } = useSystemRouter();
	// const user = useAtomValue(selectUserAtom);

	const homePath = getHomePath();
	const actualRoutes = getRoutes();

	return (
		<Routes>
			<Route path="/" element={<AuthenticatedLayout />}>
				<Route index element={<Navigate to={homePath} replace />} />
				{actualRoutes.map((item) => {
					return (
						<Route key={item.path} path={item.path} element={item.screen} />
					);
				})}
				{/* Only redirect invalid paths, not valid ones */}
				<Route path="*" element={<Navigate to={homePath} replace />} />
			</Route>
		</Routes>
	);
};

export default AuthenticatedRoutes;
