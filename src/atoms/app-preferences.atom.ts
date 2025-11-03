import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const isSideBarOpenAtom = atomWithStorage<boolean>("isSideBarOpen", true);

export const toggleAppSidebarOpenState = atom(
	(get) => get(isSideBarOpenAtom),
	(get, set) => {
		set(isSideBarOpenAtom, !get(isSideBarOpenAtom));
	}
);
