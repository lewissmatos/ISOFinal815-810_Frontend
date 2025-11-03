import { Button, Tooltip } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "@remixicon/react";
import useSystemRouter from "../../hooks/useSystemRouter";
import { toggleAppSidebarOpenState } from "../../atoms/app-preferences.atom";
import { useAtom } from "jotai";

const AppSidebar = () => {
	const { getHeaderItems } = useSystemRouter();
	const headerItems = getHeaderItems();

	const navigate = useNavigate();

	const path: string = location.pathname;

	const selectedItem = useMemo(
		() => headerItems.find((item) => (item ? path.includes(item.path) : false)),
		[path, headerItems]
	);

	const onSelectItem = useCallback(
		(path?: string) => {
			if (!path || path === selectedItem?.path) return;
			const _path = path.split("/")?.[0];
			navigate(`/${_path}`, { viewTransition: true });
		},
		[navigate, selectedItem]
	);
	const [isSidebarOpen, onToggleSidebarOpenState] = useAtom(
		toggleAppSidebarOpenState
	);
	return (
		<nav
			className={`h-full py-2 border-r-1 border-foreground-500/10 shad overflow-y-auto overflow-x-hidden transition-all duration-300 flex flex-col items-center justify-between bg-background
				${isSidebarOpen ? "w-56" : "w-14"} px-2`}
		>
			<ul className="flex flex-col gap-2 w-full items-start justify-start">
				{headerItems.map(({ path, Icon, label }, index) => {
					const isSelected = selectedItem?.label === label;
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
										isSelected
											? "justify-start border-1 border-primary-500"
											: ""
									}  ${
										isSidebarOpen
											? "justify-start border-1 border-primary-500"
											: ""
									}`}
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
		</nav>
	);
};

export default AppSidebar;
