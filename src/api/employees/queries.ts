import { useQuery } from "@tanstack/react-query";
import type { Employee } from "./types";
import type { ServiceResponse } from "../types";
import { fetchEmployees } from "./services";

export const useFetchEmployees = () => {
	const data = useQuery<ServiceResponse<Employee[]>>({
		queryKey: ["employees"],
		queryFn: fetchEmployees,
	});
	return data;
};
