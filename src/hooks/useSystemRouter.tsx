import {
	RiAccountBoxLine,
	RiBuilding2Line,
	RiFundsLine,
	RiMoneyDollarCircleLine,
} from "@remixicon/react";
import type { RemixiconComponentType } from "@remixicon/react";
import DepartmentsScreen from "../features/departments/departments-screen";
import EmployeesScreen from "../features/employees/employees-screen";

import TypeOfAssetsScreen from "../features/type-of-assets/type-of-assets-screen";
import FixedAssetsScreen from "../features/fixed-assets/fixed-assets-screen";
export type RouteItem = {
	label?: string;
	Icon?: RemixiconComponentType;
	path: string;
	subPaths?: RouteItem[];
	screen: React.ReactNode;
	roles?: string[];
	isHideFromHeader?: boolean;
	isHidden?: boolean;
};

const flattenPaths = (
	paths: RouteItem[],
	parentPath = ""
): { path: string; screen: React.ReactNode }[] => {
	return paths.flatMap((item) => {
		if (item.isHidden || item.isHideFromHeader) return [];

		const fullPath = parentPath ? `${parentPath}/${item.path}` : item.path;

		const current = item.screen
			? [{ path: fullPath, screen: item.screen }]
			: [];

		const sub = item.subPaths ? flattenPaths(item.subPaths, fullPath) : [];

		return [...current, ...sub];
	});
};

const useSystemRouter = () => {
	const authenticatedPaths: RouteItem[] = [
		{
			label: "Departamentos",
			Icon: RiBuilding2Line,
			path: "departments",
			screen: <DepartmentsScreen />,
		},
		{
			label: "Tipos de activos",
			Icon: RiFundsLine,
			path: "type-of-assets",
			screen: <TypeOfAssetsScreen />,
		},
		{
			label: "Empleados",
			Icon: RiAccountBoxLine,
			path: "employees",
			screen: <EmployeesScreen />,
		},
		{
			label: "Activos Fijos",
			Icon: RiMoneyDollarCircleLine,
			path: "fixed-assets",
			screen: <FixedAssetsScreen />,
		},
	];

	const getRoutes = () => {
		return flattenPaths(authenticatedPaths).map(({ path, screen }) => ({
			path,
			screen,
		}));
	};

	const getHeaderItems = () =>
		authenticatedPaths
			?.filter((item) => !item.isHideFromHeader && !item.isHidden)
			.map((x) => ({
				label: x.label,
				Icon: x.Icon,
				path: x.path,
			}));

	const getHomePath = (): string => {
		return "departments";
	};

	return { getRoutes, getHeaderItems, getHomePath };
};

export default useSystemRouter;
