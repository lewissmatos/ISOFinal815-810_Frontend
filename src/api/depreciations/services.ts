import client from "../client";
import type { ServiceResponse } from "../types";
import type { Depreciation, FetchDepreciationsParams } from "./types";

export const fetchDepreciations = async (
	params?: FetchDepreciationsParams
): Promise<ServiceResponse<Depreciation[]>> => {
	const response = await client.get("/depreciations", { params });
	return response.data;
};
