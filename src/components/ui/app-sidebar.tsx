import { Button, Tooltip } from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import {
	RiLogoutCircleLine,
	RiSidebarFoldLine,
	RiSidebarUnfoldLine,
} from "@remixicon/react";
import useSystemRouter from "../../hooks/useSystemRouter";
import { toggleAppSidebarOpenState } from "../../atoms/app-preferences.atom";
import { useAtom, useSetAtom } from "jotai";
import { logoutAtom } from "../../atoms/auth.atom";

const AppSidebar = () => {
	const { getHeaderItems } = useSystemRouter();
	const headerItems = getHeaderItems();

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const activeSegment = pathname.split("/")[1] ?? "";

	const selectedItem = useMemo(
		() => headerItems.find((item) => item?.path === activeSegment),
		[activeSegment, headerItems]
	);

	const onSelectItem = useCallback(
		(targetPath?: string) => {
			if (!targetPath) return;
			const normalizedPath = targetPath.startsWith("/")
				? targetPath
				: `/${targetPath}`;
			if (normalizedPath === pathname) return;
			navigate(normalizedPath, { viewTransition: true });
		},
		[navigate, pathname]
	);
	const [isSidebarOpen, onToggleSidebarOpenState] = useAtom(
		toggleAppSidebarOpenState
	);
	const triggerLogout = useSetAtom(logoutAtom);

	const onLogout = useCallback(() => {
		triggerLogout();
		navigate("/login", { replace: true, viewTransition: true });
	}, [triggerLogout, navigate]);
	return (
		<nav
			className={`h-full py-2 border-r-1 border-foreground-500/10 shad overflow-y-auto overflow-x-hidden transition-all duration-300 flex flex-col items-center justify-between bg-background
				${isSidebarOpen ? "w-56" : "w-14"} px-2`}
		>
			<ul className="flex flex-col gap-2 w-full items-start justify-start">
				{headerItems.map(({ path, Icon, label }, index) => {
					const isSelected = selectedItem?.path === path;
					const collapsedDrawerIconProps = isSidebarOpen
						? { size: 18 }
						: { size: 22 };
					return (
						<li key={index} className="w-full ">
							<Tooltip
								content={!isSidebarOpen ? label : null}
								hidden={isSidebarOpen}
								placement="right"
								showArrow
							>
								<Button
									className={`w-full transition-all px-2 flex items-center ${
										isSidebarOpen ? "justify-start" : ""
									} ${isSelected ? "border-1 border-primary-500" : ""}`}
									color={isSelected ? "primary" : "default"}
									variant={isSelected ? "flat" : "light"}
									isIconOnly={!isSidebarOpen}
									startContent={
										Icon ? (
											<Icon {...collapsedDrawerIconProps} strokeWidth={1.75} />
										) : null
									}
									onPress={() => onSelectItem(path)}
								>
									<span
										className={`${!isSidebarOpen && "ml-3 hidden"} ${
											isSelected ? "font-medium" : ""
										}`}
									>
										{label}
									</span>
								</Button>
							</Tooltip>
						</li>
					);
				})}
			</ul>
			<div className="w-full flex flex-col gap-2">
				<Tooltip
					content={!isSidebarOpen ? "Open" : null}
					hidden={isSidebarOpen}
					placement="right"
				>
					<Button
						variant="light"
						className={`w-full ${isSidebarOpen ? "justify-end" : ""}`}
						isIconOnly={!isSidebarOpen}
						onPress={onToggleSidebarOpenState}
						startContent={
							isSidebarOpen ? (
								<RiSidebarFoldLine size={18} />
							) : (
								<RiSidebarUnfoldLine size={22} />
							)
						}
					>
						{isSidebarOpen ? <span className="font-medium">Close</span> : null}
					</Button>
				</Tooltip>
				<Tooltip
					content={!isSidebarOpen ? "Cerrar sesión" : null}
					hidden={isSidebarOpen}
					placement="right"
				>
					<Button
						color="danger"
						variant="light"
						className={`w-full ${isSidebarOpen ? "justify-end" : ""}`}
						isIconOnly={!isSidebarOpen}
						onPress={onLogout}
						startContent={
							isSidebarOpen ? (
								<RiLogoutCircleLine size={18} />
							) : (
								<RiLogoutCircleLine size={22} />
							)
						}
					>
						{isSidebarOpen ? (
							<span className="font-medium">Cerrar sesión</span>
						) : null}
					</Button>
				</Tooltip>
			</div>
		</nav>
	);
};

export default AppSidebar;
