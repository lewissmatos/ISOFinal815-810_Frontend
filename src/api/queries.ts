import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ServiceResponse } from "./types";

export const useFetch = <T>(
	queryFn: () => Promise<ServiceResponse<T[]>>,
	queryKey: string[],
	options?: Partial<UseQueryOptions>
) => {
	const { enabled = true } = options || {};
	const data = useQuery<ServiceResponse<T[]>>({
		queryKey: queryKey,
		queryFn: queryFn,
		enabled: Boolean(enabled),
	});
	return data;
};
