import client from "../client";
import type { ServiceResponse } from "../types";
import type { AccountingEntry } from "./types";

export const fetchAccountingEntries = async (): Promise<
	ServiceResponse<AccountingEntry[]>
> => {
	const response = await client.get("/accounting-entries");
	return response.data;
};

export const saveAccountingEntry = async (
	payload: Partial<Omit<AccountingEntry, "id">>
): Promise<ServiceResponse<AccountingEntry>> => {
	const response = await client.post("/accounting-entries", {
		...payload,
	});
	return response.data;
};
