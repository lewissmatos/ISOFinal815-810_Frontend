import client from "../client";
import type { ServiceResponse } from "../types";
import type { AuxiliarySystem } from "./types";

export const fetchAuxiliarySystems = async (): Promise<
	ServiceResponse<AuxiliarySystem[]>
> => {
	const response = await client.get("/auxiliary-systems");
	return response.data;
};

export const fetchActiveAuxiliarySystems = async (): Promise<
	ServiceResponse<AuxiliarySystem[]>
> => {
	const response = await client.get("/auxiliary-systems/active");
	return response.data;
};

export const createAuxiliarySystem = async (
	payload?: Partial<Omit<AuxiliarySystem, "id">>
): Promise<ServiceResponse<AuxiliarySystem>> => {
	const response = await client.post("/auxiliary-systems", {
		...payload,
	});
	return response.data;
};

export const updateAuxiliarySystem = async ({
	auxiliarySystemId,
	...payload
}: {
	auxiliarySystemId: number;
} & Partial<Omit<AuxiliarySystem, "id">>): Promise<
	ServiceResponse<AuxiliarySystem>
> => {
	const response = await client.put(
		`/auxiliary-system/${auxiliarySystemId}`,
		payload
	);
	return response.data;
};

export const deleteAuxiliarySystem = async (
	auxiliarySystemId: number
): Promise<ServiceResponse<AuxiliarySystem>> => {
	const response = await client.delete(
		`/auxiliary-systems/${auxiliarySystemId}`
	);
	return response.data;
};

export const toggleAuxiliarySystemStatus = async (
	auxiliarySystemId: number
): Promise<ServiceResponse<AuxiliarySystem>> => {
	const response = await client.patch(
		`/auxiliary-systems/${auxiliarySystemId}/toggle`
	);
	return response.data;
};
