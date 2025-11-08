import client from "../client";
import type { ServiceResponse } from "../types";
import type { AccountType } from "./types";

export const fetchAccountTypes = async (): Promise<
	ServiceResponse<AccountType[]>
> => {
	const response = await client.get("/account-types");
	return response.data;
};

export const fetchActiveAccountTypes = async (): Promise<
	ServiceResponse<AccountType[]>
> => {
	const response = await client.get("/account-types/active");
	return response.data;
};

export const createAccountType = async (
	payload?: Partial<Omit<AccountType, "id">>
): Promise<ServiceResponse<AccountType>> => {
	const response = await client.post("/account-types", {
		...payload,
	});
	return response.data;
};

export const updateAccountType = async ({
	accountTypeId,
	...payload
}: {
	accountTypeId: number;
} & Partial<Omit<AccountType, "id">>): Promise<
	ServiceResponse<AccountType>
> => {
	const response = await client.put(`/account-types/${accountTypeId}`, payload);
	return response.data;
};

export const deleteAccountType = async (
	accountTypeId: number
): Promise<ServiceResponse<AccountType>> => {
	const response = await client.delete(`/account-types/${accountTypeId}`);
	return response.data;
};

export const toggleAccountTypeStatus = async (
	accountTypeId: number
): Promise<ServiceResponse<AccountType>> => {
	const response = await client.patch(`/account-types/${accountTypeId}/toggle`);
	return response.data;
};
