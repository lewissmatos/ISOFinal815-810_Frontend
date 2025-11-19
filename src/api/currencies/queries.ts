import {
	useMutation,
	useQuery,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { ServiceResponse } from "../types";
import type { Currency } from "./types";
import {
	fetchActiveCurrencies,
	fetchCurrencies,
	syncCurrencies,
	syncCurrency,
} from "./services";

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

export const useSyncCurrencies = () => {
	return useMutation({
		mutationKey: ["currencies-sync", "sync"],
		mutationFn: () => syncCurrencies(),
	});
};

export const useSyncCurrency = () => {
	return useMutation({
		mutationKey: ["currencies-sync", "sync-single"],
		mutationFn: syncCurrency,
	});
};
