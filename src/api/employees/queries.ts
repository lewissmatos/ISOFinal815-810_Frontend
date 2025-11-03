import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Employee } from "./types";
import type { ServiceResponse } from "../types";
import { fetchEmployees } from "./services";

export const useFetchEmployees = (options?: Partial<UseQueryOptions>) => {
	const { enabled = true } = options || {};
	const data = useQuery<ServiceResponse<Employee[]>>({
		queryKey: ["employees"],
		queryFn: fetchEmployees,
		enabled: Boolean(enabled),
	});
	return data;
};
