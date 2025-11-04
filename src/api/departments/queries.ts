import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Department } from "./types";
import type { ServiceResponse } from "../types";
import { fetchDepartments, fetchActiveDepartments } from "./services";

export const useFetchDepartments = (
	options?: Partial<UseQueryOptions> & { showInactive?: boolean }
) => {
	const { enabled = true, showInactive = true } = options || {};
	const data = useQuery<ServiceResponse<Department[]>>({
		queryKey: ["departments", { showInactive }],
		queryFn: showInactive ? fetchDepartments : fetchActiveDepartments,
		enabled: Boolean(enabled),
	});
	return data;
};
