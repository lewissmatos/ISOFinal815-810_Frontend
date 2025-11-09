import client from "../client";
import type { LoginPayload, LoginResponse } from "./types";

const LOGIN_ENDPOINT = "/auth/login";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
	const { data } = await client.post<{ data: LoginResponse }>(
		LOGIN_ENDPOINT,
		payload
	);
	return data.data;
};
