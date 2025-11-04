import client from "../client";
import type { ServiceResponse } from "../types";
import type { AccountingEntry } from "./types";

export const fetchAccountingEntries = async (): Promise<
	ServiceResponse<AccountingEntry[]>
> => {
	const response = await client.get("/accounting-entries");
	return response.data;
};

export const executeDepreciationProcess = async (
	fixedAssetId?: number
): Promise<ServiceResponse<{ message: string }>> => {
	const response = await client.post(
		"/depreciations" + (fixedAssetId ? `?fixedAssetId=${fixedAssetId}` : "")
	);
	return response.data;
};
