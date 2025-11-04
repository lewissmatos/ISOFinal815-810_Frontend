import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ServiceResponse } from "../types";
import { fetchAccountingEntries } from "./services";
import type { AccountingEntry } from "./types";

export const useFetchAccountingEntries = (
	options?: Partial<UseQueryOptions>
) => {
	const { enabled = true } = options || {};
	const data = useQuery<ServiceResponse<AccountingEntry[]>>({
		queryKey: ["accounting-entries"],
		queryFn: fetchAccountingEntries,
		enabled: Boolean(enabled),
	});
	return data;
};
