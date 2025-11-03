import client from "../client";
import type { ServiceResponse } from "../types";
import type { Account } from "./types";

export const fetchAccounts = async (): Promise<ServiceResponse<Account[]>> => {
	const response = await client.get("/accounts");
	return response.data;
};
