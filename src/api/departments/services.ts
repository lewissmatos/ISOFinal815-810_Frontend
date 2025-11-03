import client from "../client";
import type { ServiceResponse } from "../types";
import type { Department } from "./types";

export const fetchDepartments = async (): Promise<
	ServiceResponse<Department[]>
> => {
	const response = await client.get("/departments");
	return response.data;
};

export const createDepartment = async (
	payload?: Partial<Omit<Department, "id">>
): Promise<ServiceResponse<Department>> => {
	const response = await client.post("/departments", {
		...payload,
	});
	return response.data;
};

export const updateDepartment = async ({
	departmentId,
	...payload
}: {
	departmentId: number;
} & Partial<Omit<Department, "id">>): Promise<ServiceResponse<Department>> => {
	const response = await client.put(`/departments/${departmentId}`, payload);
	return response.data;
};

export const deleteDepartment = async (
	departmentId: number
): Promise<ServiceResponse<Department>> => {
	const response = await client.delete(`/departments/${departmentId}`);
	return response.data;
};

export const toggleDepartmentStatus = async (
	departmentId: number
): Promise<ServiceResponse<Department>> => {
	const response = await client.patch(`/departments/${departmentId}/toggle`);
	return response.data;
};
