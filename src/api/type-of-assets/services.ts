import client from "../client";
import type { ServiceResponse } from "../types";
import type { TypeOfAsset } from "./types";

export const fetchTypeOfAssets = async (): Promise<
	ServiceResponse<TypeOfAsset[]>
> => {
	const response = await client.get("/type-of-assets");
	return response.data;
};

export const createTypeOfAsset = async (
	data: Omit<TypeOfAsset, "id">
): Promise<ServiceResponse<TypeOfAsset>> => {
	const response = await client.post("/type-of-assets", {
		...data,
	});
	return response.data;
};

export const updateTypeOfAsset = async ({
	typeOfAssetId,
	...data
}: {
	typeOfAssetId: number;
} & Omit<TypeOfAsset, "id">): Promise<ServiceResponse<TypeOfAsset>> => {
	const response = await client.put(`/type-of-assets/${typeOfAssetId}`, {
		...data,
	});
	return response.data;
};

export const deleteTypeOfAsset = async (
	typeOfAssetId: number
): Promise<ServiceResponse<TypeOfAsset>> => {
	const response = await client.delete(`/type-of-assets/${typeOfAssetId}`);
	return response.data;
};

export const toggleTypeOfAssetStatus = async (
	typeOfAssetId: number
): Promise<ServiceResponse<TypeOfAsset>> => {
	const response = await client.patch(
		`/type-of-assets/${typeOfAssetId}/toggle`
	);
	return response.data;
};
