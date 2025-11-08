import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ServiceResponse } from "../types";
import type { Currency } from "./types";
import { fetchActiveCurrencies, fetchCurrencies } from "./services";

export const useFetchCurrencies = (
	options?: Partial<UseQueryOptions> & { showInactive?: boolean }
) => {
	const { enabled = true, showInactive = true } = options || {};
	const data = useQuery<ServiceResponse<Currency[]>>({
		queryKey: ["currencies", { showInactive }],
		queryFn: showInactive ? fetchCurrencies : fetchActiveCurrencies,
		enabled: Boolean(enabled),
	});
	return data;
};
