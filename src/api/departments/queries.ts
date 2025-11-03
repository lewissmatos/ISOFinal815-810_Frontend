import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Department } from "./types";
import type { ServiceResponse } from "../types";
import { fetchDepartments } from "./services";

export const useFetchDepartments = (options?: Partial<UseQueryOptions>) => {
	const { enabled = true } = options || {};
	const data = useQuery<ServiceResponse<Department[]>>({
		queryKey: ["departments"],
		queryFn: fetchDepartments,
		enabled: Boolean(enabled),
	});
	return data;
};
