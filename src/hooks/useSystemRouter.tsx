import {
	RiAppsLine,
	RiCalculatorLine,
	RiFileList2Line,
	RiHandCoinLine,
	RiMoneyDollarCircleLine,
} from "@remixicon/react";
import type { RemixiconComponentType } from "@remixicon/react";
import AccountingEntriesScreen from "../features/accounting-entries/accounting-entries-screen";
import AccountTypesScreen from "../features/account-types/account-types-screen";
import AccountsScreen from "../features/accounts/accounts-screen";
import AuxiliarySystemsScreen from "../features/auxiliary-systems/auxiliary-systems-screen";
import CurrenciesScreen from "../features/currencies/currencies-screen";
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
			label: "Tipos de Cuentas",
			Icon: RiHandCoinLine,
			path: "account-types",
			screen: <AccountTypesScreen />,
		},
		{
			label: "Cuentas",
			Icon: RiFileList2Line,
			path: "accounts",
			screen: <AccountsScreen />,
		},
		{
			label: "Sistemas Auxiliares",
			Icon: RiAppsLine,
			path: "auxiliary-systems",
			screen: <AuxiliarySystemsScreen />,
		},
		{
			label: "Monedas",
			Icon: RiMoneyDollarCircleLine,
			path: "currencies",
			screen: <CurrenciesScreen />,
		},
		{
			label: "Asientos Contables",
			Icon: RiCalculatorLine,
			path: "accounting-entries",
			screen: <AccountingEntriesScreen />,
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
