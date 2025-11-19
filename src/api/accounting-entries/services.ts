import client from "../client";
import type { ServiceResponse } from "../types";
import type { AccountingEntry, FetchAccountingEntriesFilter } from "./types";

export const fetchAccountingEntries = async (
	params?: FetchAccountingEntriesFilter
): Promise<ServiceResponse<AccountingEntry[]>> => {
	const response = await client.get("/accounting-entries", {
		params: {
			...params,
		},
	});
	return response.data;
};

export const saveAccountingEntry = async (
	payload: Partial<Omit<AccountingEntry, "id">>
): Promise<ServiceResponse<AccountingEntry>> => {
	const response = await client.post("/accounting-entries", {
		description: payload.description,
		accountId: Number(payload.accountId),
		auxiliaryId: Number(payload.auxiliaryId),
		movementType: payload.movementType,
		amount: payload.amount,
	});
	return response.data;
};
