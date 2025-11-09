import type { AuxiliarySystem } from "../auxiliary-systems/types";

export type LoginPayload = {
	username: string;
	password: string;
};

export type AuthUser = {
	username: string;
	auxiliarySystem: AuxiliarySystem;
};

export type LoginResponse = {
	token: string;
	auth?: AuthUser;
	user?: AuthUser;
};
