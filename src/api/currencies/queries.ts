import {
	useMutation,
	useQuery,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { ServiceResponse } from "../types";
import type { Currency, UpdateCurrencyRate } from "./types";
import {
	fetchActiveCurrencies,
	fetchCurrencies,
	syncCurrency,
	updateCurrencyRate,
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
	const { mutateAsync: onUpdateCurrency } = useSyncCurrency();
	return useMutation({
		mutationKey: ["currencies-sync", "sync"],
		mutationFn: async () => {
			const currencies = await fetchCurrencies();
			for (const currency of currencies.data || []) {
				await onUpdateCurrency({
					code: currency.ISOCode,
					id: currency.id,
				});
			}
		},
	});
};

export const useSyncCurrency = () => {
	return useMutation({
		mutationKey: ["currencies-sync", "sync-single"],
		mutationFn: async ({ code, id }: { code: string; id: number }) => {
			const response = await updateCurrencyRate(code);
			const { data } = response;
			const payload: UpdateCurrencyRate = {
				code: data ? data["moneda"] : code,
				rate: data ? data["tasa"] : 0,
			};
			await syncCurrency(id, payload);
		},
	});
};
