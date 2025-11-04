import client from "../client";
import type { ServiceResponse } from "../types";
import type { FixedAsset } from "./types";

export const fetchFixedAssets = async (): Promise<
	ServiceResponse<FixedAsset[]>
> => {
	const response = await client.get("/fixed-assets");
	return response.data;
};

export const fetchActiveFixedAssets = async (): Promise<
	ServiceResponse<FixedAsset[]>
> => {
	const response = await client.get("/fixed-assets/active");
	return response.data;
};

export const createFixedAsset = async (
	data: Omit<FixedAsset, "id">
): Promise<ServiceResponse<FixedAsset>> => {
	const response = await client.post("/fixed-assets", {
		...data,
	});
	return response.data;
};

export const updateFixedAsset = async ({
	fixedAssetId,
	...data
}: {
	fixedAssetId: number;
} & Omit<FixedAsset, "id">): Promise<ServiceResponse<FixedAsset>> => {
	const response = await client.put(`/fixed-assets/${fixedAssetId}`, {
		...data,
	});
	return response.data;
};

export const deleteFixedAsset = async (
	fixedAssetId: number
): Promise<ServiceResponse<FixedAsset>> => {
	const response = await client.delete(`/fixed-assets/${fixedAssetId}`);
	return response.data;
};

export const toggleFixedAssetStatus = async (
	fixedAssetId: number
): Promise<ServiceResponse<FixedAsset>> => {
	const response = await client.patch(`/fixed-assets/${fixedAssetId}/toggle`);
	return response.data;
};
