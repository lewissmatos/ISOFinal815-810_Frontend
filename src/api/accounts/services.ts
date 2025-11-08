import client from "../client";
import type { ServiceResponse } from "../types";
import type { Account } from "./types";

export const fetchAccounts = async (): Promise<ServiceResponse<Account[]>> => {
	const response = await client.get("/accounts");
	return response.data;
};

export const fetchActiveAccounts = async (): Promise<
	ServiceResponse<Account[]>
> => {
	const response = await client.get("/accounts/active");
	return response.data;
};

export const createAccount = async (
	payload?: Partial<Omit<Account, "id">>
): Promise<ServiceResponse<Account>> => {
	const response = await client.post("/accounts", {
		...payload,
	});
	return response.data;
};

export const updateAccount = async ({
	accountId,
	...payload
}: {
	accountId: number;
} & Partial<Omit<Account, "id">>): Promise<ServiceResponse<Account>> => {
	const response = await client.put(`/accounts/${accountId}`, payload);
	return response.data;
};

export const deleteAccount = async (
	accountId: number
): Promise<ServiceResponse<Account>> => {
	const response = await client.delete(`/accounts/${accountId}`);
	return response.data;
};

export const toggleAccountStatus = async (
	accountId: number
): Promise<ServiceResponse<Account>> => {
	const response = await client.patch(`/accounts/${accountId}/toggle`);
	return response.data;
};
