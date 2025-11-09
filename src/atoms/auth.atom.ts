import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { AuthUser, LoginResponse } from "../api/auth/types";
import getQueryClient from "../lib/getQueryClient";

export type AuthState = {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
};

const AUTH_STORAGE_KEY = "iso815-auth-state";

const defaultAuthState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
};

const persistedAuthAtom = atomWithStorage<AuthState>(
	AUTH_STORAGE_KEY,
	defaultAuthState,
	undefined,
	{ getOnInit: true }
);

export const authStateAtom = atom((get) => {
	const state = get(persistedAuthAtom) ?? defaultAuthState;
	const token = state.token ?? null;
	const user = state.user ?? null;

	return {
		user,
		token,
		isAuthenticated: Boolean(token) && Boolean(user),
	};
});

export const authAtom = atom((get) => get(authStateAtom).user);
export const tokenAtom = atom((get) => get(authStateAtom).token);
export const isAuthenticatedAtom = atom(
	(get) => get(authStateAtom).isAuthenticated
);

export const loginAtom = atom(null, (_get, set, payload: LoginResponse) => {
	const token = payload?.token ?? null;
	const user = payload?.auth ?? (payload as { user?: AuthUser })?.user ?? null;

	const nextState: AuthState = {
		user,
		token,
		isAuthenticated: Boolean(token) && Boolean(user),
	};

	set(persistedAuthAtom, nextState);

	if (token) {
		localStorage.setItem("token", token);
	} else {
		localStorage.removeItem("token");
	}
});

export const logoutAtom = atom(null, (_get, set) => {
	// Clear cached queries and reset the authentication state when signing out.
	getQueryClient().clear();
	set(persistedAuthAtom, defaultAuthState);
	localStorage.removeItem("token");
});

export default authStateAtom;
