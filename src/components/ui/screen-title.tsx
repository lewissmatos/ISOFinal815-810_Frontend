import React, { type FC } from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
};

const ScreenTitle: FC<Props> = React.memo(
	({ children, className, ...props }) => {
		return (
			<h2
				className={`text-2xl font-semibold ${className}`}
				{...props}
				data-testid="screen-title-component"
			>
				{children}
			</h2>
		);
	}
);

export default ScreenTitle;
