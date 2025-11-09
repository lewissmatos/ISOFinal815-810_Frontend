import { useEffect, useState, type ReactNode } from "react";
import { useAtom } from "jotai";
import { toggleAppSidebarOpenState } from "./app-preferences.atom";

export const AppAtomsGate = ({ children }: { children: ReactNode }) => {
	useAtom(toggleAppSidebarOpenState);

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		document.body.className = `app-light text-foreground bg-background`;
		setIsReady(true);
	}, [setIsReady]);

	return isReady ? <>{children}</> : null;
};
