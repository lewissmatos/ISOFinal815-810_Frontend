import client from "../client";
import type { ServiceResponse } from "../types";
import type { Employee } from "./types";

export const fetchEmployees = async (): Promise<
	ServiceResponse<Employee[]>
> => {
	const response = await client.get("/employees");
	return response.data;
};

export const createEmployee = async (
	data: Omit<Employee, "id">
): Promise<ServiceResponse<Employee>> => {
	const response = await client.post("/employees", {
		...data,
	});
	return response.data;
};

export const updateEmployee = async ({
	employeeId,
	...data
}: {
	employeeId: number;
} & Omit<Employee, "id">): Promise<ServiceResponse<Employee>> => {
	const response = await client.put(`/employees/${employeeId}`, {
		...data,
	});
	return response.data;
};

export const deleteEmployee = async (
	employeeId: number
): Promise<ServiceResponse<Employee>> => {
	const response = await client.delete(`/employees/${employeeId}`);
	return response.data;
};

export const toggleEmployeeStatus = async (
	employeeId: number
): Promise<ServiceResponse<Employee>> => {
	const response = await client.patch(`/employees/${employeeId}/toggle`);
	return response.data;
};
