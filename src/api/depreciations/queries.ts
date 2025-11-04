import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ServiceResponse } from "../types";
import type { Depreciation, FetchDepreciationsParams } from "./types";
import { fetchDepreciations } from "./services";

export const useFetchDepreciations = (
	params?: FetchDepreciationsParams,
	options?: Partial<UseQueryOptions>
) => {
	const { enabled = true } = options || {};
	const data = useQuery<ServiceResponse<Depreciation[]>>({
		queryKey: ["depreciations"],
		queryFn: () => fetchDepreciations(params),
		enabled: Boolean(enabled),
	});
	return data;
};
