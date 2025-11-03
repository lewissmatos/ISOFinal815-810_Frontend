import React from "react";
interface ScreenWrapperProps {
	children: React.ReactNode;
	className?: string;
}

export const ScreenLayout = ({
	children,
	className = "",
	...props
}: ScreenWrapperProps) => {
	return (
		<div {...props} className={` py-4 px-6 h-full rounded-sm ${className}`}>
			{children}
		</div>
	);
};

ScreenLayout.displayName = "ScreenLayout";
