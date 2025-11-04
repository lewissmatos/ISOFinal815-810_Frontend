import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Employee } from "./types";
import type { ServiceResponse } from "../types";
import { fetchEmployees, fetchActiveEmployees } from "./services";

export const useFetchEmployees = (
	options?: Partial<UseQueryOptions> & { showInactive?: boolean }
) => {
	const { enabled = true, showInactive = true } = options || {};
	const data = useQuery<ServiceResponse<Employee[]>>({
		queryKey: ["employees", { showInactive }],
		queryFn: showInactive ? fetchEmployees : fetchActiveEmployees,
		enabled: Boolean(enabled),
	});
	return data;
};
