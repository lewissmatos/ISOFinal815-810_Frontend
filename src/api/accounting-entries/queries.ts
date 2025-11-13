import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ServiceResponse } from "../types";
import { fetchAccountingEntries } from "./services";
import type { AccountingEntry, FetchAccountingEntriesFilter } from "./types";

export const useFetchAccountingEntries = (
	params?: FetchAccountingEntriesFilter,
	options?: Partial<UseQueryOptions>
) => {
	const { enabled = true } = options || {};
	const data = useQuery<ServiceResponse<AccountingEntry[]>>({
		queryKey: ["accounting-entries", params],
		queryFn: () => fetchAccountingEntries(params),
		enabled: Boolean(enabled),
	});
	return data;
};
